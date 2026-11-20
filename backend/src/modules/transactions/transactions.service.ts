import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { RabbitMQService } from '../../rabbitmq/rabbitmq.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { VerifyTransactionDto } from './dto/verify-transaction.dto';
import { TransactionStatus, Role } from '@prisma/client';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);
  private readonly OTP_TTL_SECONDS = parseInt(process.env.OTP_TTL_SECONDS || '600', 10);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly rabbitmq: RabbitMQService,
  ) {}

  async createTransaction(borrowerId: string, dto: CreateTransactionDto) {
    // 1. Verify lender exists and has role LENDER
    const lender = await this.prisma.user.findUnique({
      where: { id: dto.lenderId },
    });
    if (!lender) {
      throw new NotFoundException(`Lender with ID ${dto.lenderId} not found`);
    }
    if (lender.role !== Role.LENDER) {
      throw new BadRequestException('Target user is not registered as a LENDER');
    }

    if (borrowerId === dto.lenderId) {
      throw new BadRequestException('Borrower and lender cannot be the same user');
    }

    // 2. Determine previousHash from the latest verified transaction in the ledger
    const lastVerified = await this.prisma.transaction.findFirst({
      where: {
        status: TransactionStatus.VERIFIED,
        currentHash: { not: null },
      },
      orderBy: { verifiedAt: 'desc' },
    });

    const previousHash = lastVerified?.currentHash || 'GENESIS_HASH_000';

    // 3. Create the transaction with PENDING status
    const transaction = await this.prisma.transaction.create({
      data: {
        borrowerId,
        lenderId: dto.lenderId,
        amount: dto.amount,
        type: dto.type,
        status: TransactionStatus.PENDING,
        description: dto.description,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        previousHash,
      },
      include: {
        borrower: { select: { id: true, name: true, phone: true } },
        lender: { select: { id: true, name: true, phone: true } },
      },
    });

    // 4. Generate 6-digit numeric OTP and store in Redis with 10-minute TTL
    const otp = crypto.randomInt(100000, 999999).toString();
    await this.redis.setOTP(transaction.id, otp, this.OTP_TTL_SECONDS);

    this.logger.log(`Created transaction ${transaction.id}. OTP generated with TTL ${this.OTP_TTL_SECONDS}s`);

    return {
      transaction,
      otp, // Provided to borrower to convey to lender in person
      message: 'Transaction logged. Share this 6-digit OTP with your counterparty to verify.',
    };
  }

  async verifyTransaction(transactionId: string, lenderId: string, dto: VerifyTransactionDto) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        borrower: { select: { id: true, name: true, phone: true } },
        lender: { select: { id: true, name: true, phone: true } },
      },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction ${transactionId} not found`);
    }

    if (transaction.lenderId !== lenderId) {
      throw new ForbiddenException('Only the designated counterparty/lender can verify this transaction');
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new BadRequestException(`Transaction is already ${transaction.status}`);
    }

    // Retrieve and validate OTP from Redis
    const storedOtp = await this.redis.getOTP(transactionId);
    if (!storedOtp) {
      throw new BadRequestException('OTP has expired or is invalid. Please request a new transaction.');
    }

    // Constant-time comparison to prevent timing attacks
    const isMatch =
      storedOtp.length === dto.otp.length &&
      crypto.timingSafeEqual(Buffer.from(storedOtp), Buffer.from(dto.otp));

    if (!isMatch) {
      throw new BadRequestException('Invalid OTP provided');
    }

    // Compute Cryptographic SHA-256 Hash for the Block/Ledger
    const verifiedAt = new Date();
    const dataToHash = `${transaction.previousHash}${transaction.borrowerId}${transaction.lenderId}${transaction.amount.toString()}${transaction.type}${verifiedAt.toISOString()}`;
    const currentHash = crypto.createHash('sha256').update(dataToHash).digest('hex');

    // Update Transaction to VERIFIED
    const updatedTransaction = await this.prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: TransactionStatus.VERIFIED,
        verifiedAt,
        currentHash,
      },
      include: {
        borrower: { select: { id: true, name: true, phone: true } },
        lender: { select: { id: true, name: true, phone: true } },
      },
    });

    // Cleanup OTP in Redis
    await this.redis.deleteOTP(transactionId);

    // Publish event to RabbitMQ for Scoring Engine
    await this.rabbitmq.publishTransactionVerified({
      transactionId: updatedTransaction.id,
      borrowerId: updatedTransaction.borrowerId,
      lenderId: updatedTransaction.lenderId,
      amount: updatedTransaction.amount.toString(),
      type: updatedTransaction.type,
      currentHash: updatedTransaction.currentHash,
      previousHash: updatedTransaction.previousHash,
      verifiedAt: verifiedAt.toISOString(),
    });

    this.logger.log(`Transaction ${transactionId} verified. Hash chain updated. Event published.`);

    return {
      message: 'Transaction successfully verified and added to cryptographic ledger',
      transaction: updatedTransaction,
    };
  }

  async getMyTransactions(borrowerId: string) {
    return this.prisma.transaction.findMany({
      where: { borrowerId },
      orderBy: { createdAt: 'desc' },
      include: {
        lender: { select: { id: true, name: true, phone: true } },
      },
    });
  }

  async getPendingForLender(lenderId: string) {
    return this.prisma.transaction.findMany({
      where: {
        lenderId,
        status: TransactionStatus.PENDING,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        borrower: { select: { id: true, name: true, phone: true } },
      },
    });
  }

  async getVerifiedForLender(lenderId: string) {
    return this.prisma.transaction.findMany({
      where: {
        lenderId,
        status: TransactionStatus.VERIFIED,
      },
      orderBy: { verifiedAt: 'desc' },
      include: {
        borrower: { select: { id: true, name: true, phone: true } },
      },
    });
  }

  async getTransactionById(id: string) {
    const tx = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        borrower: { select: { id: true, name: true, phone: true } },
        lender: { select: { id: true, name: true, phone: true } },
      },
    });
    if (!tx) throw new NotFoundException('Transaction not found');
    return tx;
  }
}
