import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from '../src/modules/transactions/transactions.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { RedisService } from '../src/redis/redis.service';
import { RabbitMQService } from '../src/rabbitmq/rabbitmq.service';
import { BadRequestException } from '@nestjs/common';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let prisma: PrismaService;
  let redis: RedisService;
  let rabbit: RabbitMQService;

  const mockPrisma = {
    transaction: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockRedis = {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  };

  const mockRabbit = {
    publishEvent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
        { provide: RabbitMQService, useValue: mockRabbit },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    prisma = module.get<PrismaService>(PrismaService);
    redis = module.get<RedisService>(RedisService);
    rabbit = module.get<RabbitMQService>(RabbitMQService);
    jest.clearAllMocks();
  });

  describe('createTransaction', () => {
    it('should generate an OTP and store it in Redis', async () => {
      mockPrisma.transaction.findFirst.mockResolvedValueOnce(null);
      mockPrisma.transaction.create.mockResolvedValueOnce({
        id: 'tx-1',
        borrowerId: 'b-1',
        lenderId: 'l-1',
        amount: 5000,
        type: 'LOAN',
        status: 'PENDING_VERIFICATION',
        previousHash: '0'.repeat(64),
      });

      const res = await service.create('b-1', {
        lenderId: 'l-1',
        amount: 5000,
        type: 'LOAN' as any,
        metadata: { notes: 'Loan for inventory' },
      });

      expect(res.id).toBe('tx-1');
      expect(mockRedis.set).toHaveBeenCalled();
    });
  });

  describe('verifyTransaction', () => {
    it('should throw BadRequestException if OTP is incorrect', async () => {
      mockRedis.get.mockResolvedValueOnce('123456');

      await expect(
        service.verify('tx-1', 'l-1', { otp: '999999' }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
