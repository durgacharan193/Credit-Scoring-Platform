import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MultiCurrencyService {
  private readonly logger = new Logger('MultiCurrencyService');

  async process(payload: Record<string, any>): Promise<Record<string, any>> {
    this.logger.log('Processing in MultiCurrencyService');
    return {
      status: 'SUCCESS',
      module: 'MultiCurrency',
      timestamp: new Date().toISOString(),
      data: payload
    };
  }
}
