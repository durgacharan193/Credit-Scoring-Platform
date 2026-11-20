import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TaxCalculationServiceService {
  private readonly logger = new Logger('TaxCalculationServiceService');

  async process(payload: Record<string, any>): Promise<Record<string, any>> {
    this.logger.log('Processing in TaxCalculationServiceService');
    return {
      status: 'SUCCESS',
      module: 'TaxCalculationService',
      timestamp: new Date().toISOString(),
      data: payload
    };
  }
}
