import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { VerifyTransactionDto } from './dto/verify-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @Roles(Role.BORROWER)
  @HttpCode(HttpStatus.CREATED)
  async createTransaction(
    @CurrentUser('id') borrowerId: string,
    @Body() dto: CreateTransactionDto,
  ) {
    return this.transactionsService.createTransaction(borrowerId, dto);
  }

  @Get('my')
  @Roles(Role.BORROWER)
  async getMyTransactions(@CurrentUser('id') borrowerId: string) {
    return this.transactionsService.getMyTransactions(borrowerId);
  }

  @Get('pending')
  @Roles(Role.LENDER)
  async getPendingTransactions(@CurrentUser('id') lenderId: string) {
    return this.transactionsService.getPendingForLender(lenderId);
  }

  @Get('verified')
  @Roles(Role.LENDER)
  async getVerifiedTransactions(@CurrentUser('id') lenderId: string) {
    return this.transactionsService.getVerifiedForLender(lenderId);
  }

  @Post(':id/verify')
  @Roles(Role.LENDER)
  @HttpCode(HttpStatus.OK)
  async verifyTransaction(
    @Param('id') transactionId: string,
    @CurrentUser('id') lenderId: string,
    @Body() dto: VerifyTransactionDto,
  ) {
    return this.transactionsService.verifyTransaction(transactionId, lenderId, dto);
  }

  @Get(':id')
  async getTransaction(@Param('id') id: string) {
    return this.transactionsService.getTransactionById(id);
  }
}
