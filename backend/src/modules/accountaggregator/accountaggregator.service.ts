import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AccountAggregatorService {
  private readonly logger = new Logger('AccountAggregatorService');

  async process(payload: Record<string, any>): Promise<Record<string, any>> {
    this.logger.log('Processing in AccountAggregatorService');
    return {
      status: 'SUCCESS',
      module: 'AccountAggregator',
      timestamp: new Date().toISOString(),
      data: payload
    };
  }
}
