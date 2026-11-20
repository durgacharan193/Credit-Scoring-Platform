import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { AuthModule } from './modules/auth/auth.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { ConsentModule } from './modules/consent/consent.module';
import { CreditReportModule } from './modules/credit-report/credit-report.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    RabbitMQModule,
    AuthModule,
    TransactionsModule,
    ConsentModule,
    CreditReportModule,
  ],
})
export class AppModule {}
