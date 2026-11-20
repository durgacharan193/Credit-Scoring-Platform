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
import { ConsentService } from './consent.service';
import { CreateConsentDto } from './dto/create-consent.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('consent')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ConsentController {
  constructor(private readonly consentService: ConsentService) {}

  @Post('request')
  @Roles(Role.BANK_OFFICER)
  @HttpCode(HttpStatus.CREATED)
  async requestConsent(
    @CurrentUser('id') bankOfficerId: string,
    @Body() dto: CreateConsentDto,
  ) {
    return this.consentService.createConsentRequest(bankOfficerId, dto);
  }

  @Get('pending')
  @Roles(Role.BORROWER)
  async getPendingRequests(@CurrentUser('id') borrowerId: string) {
    return this.consentService.getPendingRequestsForBorrower(borrowerId);
  }

  @Post(':id/approve')
  @Roles(Role.BORROWER)
  @HttpCode(HttpStatus.OK)
  async approveConsent(
    @Param('id') requestId: string,
    @CurrentUser('id') borrowerId: string,
  ) {
    return this.consentService.approveConsent(requestId, borrowerId);
  }

  @Post(':id/reject')
  @Roles(Role.BORROWER)
  @HttpCode(HttpStatus.OK)
  async rejectConsent(
    @Param('id') requestId: string,
    @CurrentUser('id') borrowerId: string,
  ) {
    return this.consentService.rejectConsent(requestId, borrowerId);
  }

  @Get('officer-requests')
  @Roles(Role.BANK_OFFICER)
  async getOfficerRequests(@CurrentUser('id') bankOfficerId: string) {
    return this.consentService.getRequestsByBankOfficer(bankOfficerId);
  }
}
