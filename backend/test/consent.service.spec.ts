import { Test, TestingModule } from '@nestjs/testing';
import { ConsentService } from '../src/modules/consent/consent.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { RedisService } from '../src/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';

describe('ConsentService', () => {
  let service: ConsentService;
  let prisma: PrismaService;
  let redis: RedisService;
  let jwt: JwtService;

  const mockPrisma = {
    consent: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockRedis = {
    set: jest.fn(),
    get: jest.fn(),
  };

  const mockJwt = {
    sign: jest.fn().mockReturnValue('mock-consent-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsentService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<ConsentService>(ConsentService);
    prisma = module.get<PrismaService>(PrismaService);
    redis = module.get<RedisService>(RedisService);
    jwt = module.get<JwtService>(JwtService);
    jest.clearAllMocks();
  });

  describe('requestConsent', () => {
    it('should throw NotFoundException if borrower is not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.create('officer-1', {
          borrowerId: 'unknown-borrower',
          purpose: 'LOAN_UNDERWRITING' as any,
          expiresInHours: 1,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
