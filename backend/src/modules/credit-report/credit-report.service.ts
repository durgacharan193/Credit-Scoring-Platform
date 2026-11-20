import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { ConsentStatus, TransactionStatus } from '@prisma/client';

@Injectable()
export class CreditReportService {
  private readonly logger = new Logger(CreditReportService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly jwtService: JwtService,
  ) {}

  async getCreditReport(borrowerId: string, bankOfficerId: string, consentToken?: string) {
    if (!consentToken) {
      throw new UnauthorizedException('Missing consent token in header (x-consent-token or consent-token)');
    }

    // 1. Verify and decode JWT consent token
    let payload: any;
    try {
      payload = this.jwtService.verify(consentToken);
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired consent token');
    }

    // 2. Validate token attributes
    if (
      payload.type !== 'BANK_CREDIT_REPORT_ACCESS' ||
      payload.borrowerId !== borrowerId ||
      payload.bankOfficerId !== bankOfficerId
    ) {
      throw new ForbiddenException('Consent token does not grant permission for this borrower/officer pair');
    }

    // 3. Verify against Redis to confirm active session
    const storedToken = await this.redis.getConsentToken(payload.sub);
    if (!storedToken || storedToken !== consentToken) {
      // Fallback check: check database if consentRequest is still APPROVED and unexpired
      const consentReq = await this.prisma.consentRequest.findUnique({
        where: { id: payload.sub },
      });

      if (
        !consentReq ||
        consentReq.status !== ConsentStatus.APPROVED ||
        (consentReq.tokenExpiresAt && consentReq.tokenExpiresAt < new Date())
      ) {
        throw new UnauthorizedException('Consent token has been revoked or expired');
      }
    }

    // 4. Retrieve Borrower Profile
    const borrower = await this.prisma.user.findUnique({
      where: { id: borrowerId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });

    if (!borrower) {
      throw new NotFoundException(`Borrower ${borrowerId} not found`);
    }

    // 5. Retrieve CreditReport from database
    let report = await this.prisma.creditReport.findUnique({
      where: { borrowerId },
    });

    // If report does not exist yet, build initial baseline
    if (!report) {
      const cachedScore = await this.redis.getCreditScore(borrowerId);
      report = await this.prisma.creditReport.create({
        data: {
          borrowerId,
          score: cachedScore || 300,
          riskTier: 'UNRATED',
          punctualityPct: 0,
          uniqueLenderCount: 0,
          totalLoans: 0,
          totalRepayments: 0,
          collusionFlag: false,
          hashChainValid: true,
        },
      });
    }

    // 6. Retrieve verified immutable transaction ledger for audit
    const transactions = await this.prisma.transaction.findMany({
      where: {
        borrowerId,
        status: TransactionStatus.VERIFIED,
      },
      orderBy: { verifiedAt: 'desc' },
      take: 20,
      include: {
        lender: { select: { id: true, name: true, phone: true } },
      },
    });

    this.logger.log(`Credit report accessed for borrower ${borrowerId} by officer ${bankOfficerId}`);

    return {
      borrower,
      creditReport: report,
      auditTrail: transactions,
      meta: {
        generatedAt: new Date().toISOString(),
        consentRequestId: payload.sub,
        officerId: bankOfficerId,
      },
    };
  }
}
