import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { CreateConsentDto } from './dto/create-consent.dto';
import { ConsentStatus, Role } from '@prisma/client';

@Injectable()
export class ConsentService {
  private readonly logger = new Logger(ConsentService.name);
  private readonly CONSENT_TTL_SECONDS = 3600; // 1 hour

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly jwtService: JwtService,
  ) {}

  async createConsentRequest(bankOfficerId: string, dto: CreateConsentDto) {
    // 1. Verify borrower exists and has role BORROWER
    const borrower = await this.prisma.user.findUnique({
      where: { id: dto.borrowerId },
    });
    if (!borrower) {
      throw new NotFoundException(`Borrower with ID ${dto.borrowerId} not found`);
    }
    if (borrower.role !== Role.BORROWER) {
      throw new BadRequestException('Target user is not a BORROWER');
    }

    // 2. Check if active pending request already exists
    const existing = await this.prisma.consentRequest.findFirst({
      where: {
        borrowerId: dto.borrowerId,
        bankOfficerId,
        status: ConsentStatus.PENDING,
      },
    });
    if (existing) {
      return {
        message: 'A pending consent request already exists for this borrower',
        consentRequest: existing,
      };
    }

    const consentRequest = await this.prisma.consentRequest.create({
      data: {
        borrowerId: dto.borrowerId,
        bankOfficerId,
        status: ConsentStatus.PENDING,
      },
      include: {
        borrower: { select: { id: true, name: true, email: true, phone: true } },
        bankOfficer: { select: { id: true, name: true, email: true } },
      },
    });

    this.logger.log(`Created consent request ${consentRequest.id} for borrower ${dto.borrowerId}`);

    return {
      message: 'Consent request created and pending borrower authorization',
      consentRequest,
    };
  }

  async getPendingRequestsForBorrower(borrowerId: string) {
    return this.prisma.consentRequest.findMany({
      where: {
        borrowerId,
        status: ConsentStatus.PENDING,
      },
      include: {
        bankOfficer: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approveConsent(requestId: string, borrowerId: string) {
    const request = await this.prisma.consentRequest.findUnique({
      where: { id: requestId },
      include: {
        bankOfficer: { select: { id: true, name: true, email: true } },
      },
    });

    if (!request) {
      throw new NotFoundException(`Consent request ${requestId} not found`);
    }
    if (request.borrowerId !== borrowerId) {
      throw new ForbiddenException('You can only approve consent requests directed to you');
    }
    if (request.status !== ConsentStatus.PENDING) {
      throw new BadRequestException(`Request is already ${request.status}`);
    }

    // Generate short-lived cryptographically signed JWT consent token (1 hour)
    const tokenExpiresAt = new Date(Date.now() + this.CONSENT_TTL_SECONDS * 1000);
    const payload = {
      sub: request.id,
      borrowerId: request.borrowerId,
      bankOfficerId: request.bankOfficerId,
      type: 'BANK_CREDIT_REPORT_ACCESS',
      scope: 'read:credit_report',
    };

    const consentToken = this.jwtService.sign(payload, {
      expiresIn: `${this.CONSENT_TTL_SECONDS}s`,
    });

    // Store token in Redis
    await this.redis.setConsentToken(request.id, consentToken, this.CONSENT_TTL_SECONDS);

    const updated = await this.prisma.consentRequest.update({
      where: { id: requestId },
      data: {
        status: ConsentStatus.APPROVED,
        consentToken,
        tokenExpiresAt,
      },
    });

    this.logger.log(`Consent request ${requestId} approved. Token generated.`);

    return {
      message: 'Consent granted successfully. Access token issued for Bank Officer.',
      consentRequest: updated,
      consentToken,
    };
  }

  async rejectConsent(requestId: string, borrowerId: string) {
    const request = await this.prisma.consentRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException(`Consent request ${requestId} not found`);
    }
    if (request.borrowerId !== borrowerId) {
      throw new ForbiddenException('You can only reject consent requests directed to you');
    }
    if (request.status !== ConsentStatus.PENDING) {
      throw new BadRequestException(`Request is already ${request.status}`);
    }

    const updated = await this.prisma.consentRequest.update({
      where: { id: requestId },
      data: { status: ConsentStatus.REJECTED },
    });

    return {
      message: 'Consent request rejected.',
      consentRequest: updated,
    };
  }

  async getRequestsByBankOfficer(bankOfficerId: string) {
    return this.prisma.consentRequest.findMany({
      where: { bankOfficerId },
      include: {
        borrower: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
