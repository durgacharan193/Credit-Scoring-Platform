import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/modules/auth/auth.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwt: JwtService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwt = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should throw ConflictException if user already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 'u1', email: 'test@example.com' });

      await expect(
        service.register({
          email: 'test@example.com',
          phone: '+919876543210',
          password: 'Password123!',
          name: 'Test User',
          role: 'BORROWER' as any,
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should hash password and create new user', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.create.mockResolvedValueOnce({
        id: 'u1',
        email: 'test@example.com',
        phone: '+919876543210',
        name: 'Test User',
        role: 'BORROWER',
      });

      const res = await service.register({
        email: 'test@example.com',
        phone: '+919876543210',
        password: 'Password123!',
        name: 'Test User',
        role: 'BORROWER' as any,
      });

      expect(res.user.email).toBe('test@example.com');
      expect(res.accessToken).toBe('mock-jwt-token');
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if credentials invalid', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.login({
          email: 'missing@example.com',
          password: 'Password123!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
