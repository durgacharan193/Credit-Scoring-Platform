import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;

  constructor() {
    this.client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async setOTP(transactionId: string, otp: string, ttlSeconds: number): Promise<void> {
    await this.client.set(`otp:${transactionId}`, otp, 'EX', ttlSeconds);
  }

  async getOTP(transactionId: string): Promise<string | null> {
    return this.client.get(`otp:${transactionId}`);
  }

  async deleteOTP(transactionId: string): Promise<void> {
    await this.client.del(`otp:${transactionId}`);
  }

  async setConsentToken(requestId: string, token: string, ttlSeconds: number): Promise<void> {
    await this.client.set(`consent:${requestId}`, token, 'EX', ttlSeconds);
  }

  async getConsentToken(requestId: string): Promise<string | null> {
    return this.client.get(`consent:${requestId}`);
  }

  async setCreditScore(borrowerId: string, score: number): Promise<void> {
    await this.client.set(`score:${borrowerId}`, score.toString());
  }

  async getCreditScore(borrowerId: string): Promise<number | null> {
    const val = await this.client.get(`score:${borrowerId}`);
    return val !== null ? parseInt(val, 10) : null;
  }
}
