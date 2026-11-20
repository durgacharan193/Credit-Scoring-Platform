import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConsentController } from './consent.controller';
import { ConsentService } from './consent.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { RedisModule } from '../../redis/redis.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'credit-super-secret-key-32chars!!',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [ConsentController],
  providers: [ConsentService],
  exports: [ConsentService],
})
export class ConsentModule {}
