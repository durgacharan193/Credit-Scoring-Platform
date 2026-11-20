import { Test, TestingModule } from '@nestjs/testing';
import { CreditReportService } from '../src/modules/credit-report/credit-report.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { RedisService } from '../src/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('CreditReportService', () => {
  let service: CreditReportService;
  let prisma: PrismaService;
  let redis: RedisService;
  let jwt: JwtService;

  const mockPrisma = {
    creditReport: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    transaction: {
      findMany: jest.fn(),
    },
  };

  const mockRedis = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const mockJwt = {
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreditReportService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<CreditReportService>(CreditReportService);
    prisma = module.get<PrismaService>(PrismaService);
    redis = module.get<RedisService>(RedisService);
    jwt = module.get<JwtService>(JwtService);
    jest.clearAllMocks();
  });

  describe('getReportWithConsent', () => {
    it('should throw UnauthorizedException if consent token is invalid', async () => {
      mockJwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(
        service.getReport('b-1', 'bad-token'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
