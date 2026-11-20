import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CreditReportController } from './credit-report.controller';
import { CreditReportService } from './credit-report.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { RedisModule } from '../../redis/redis.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'credit-super-secret-key-32chars!!',
    }),
  ],
  controllers: [CreditReportController],
  providers: [CreditReportService],
  exports: [CreditReportService],
})
export class CreditReportModule {}
