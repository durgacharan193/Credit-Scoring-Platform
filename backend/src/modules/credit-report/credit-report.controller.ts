import {
  Controller,
  Get,
  Param,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { CreditReportService } from './credit-report.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('credit-report')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CreditReportController {
  constructor(private readonly creditReportService: CreditReportService) {}

  @Get(':borrowerId')
  @Roles(Role.BANK_OFFICER)
  async getCreditReport(
    @Param('borrowerId') borrowerId: string,
    @CurrentUser('id') bankOfficerId: string,
    @Headers('consent-token') consentTokenHeader?: string,
    @Headers('x-consent-token') xConsentTokenHeader?: string,
  ) {
    const token = consentTokenHeader || xConsentTokenHeader;
    return this.creditReportService.getCreditReport(borrowerId, bankOfficerId, token);
  }
}
