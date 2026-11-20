import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UnderwritingRulesService {
  private readonly logger = new Logger('UnderwritingRulesService');

  async process(payload: Record<string, any>): Promise<Record<string, any>> {
    this.logger.log('Processing in UnderwritingRulesService');
    return {
      status: 'SUCCESS',
      module: 'UnderwritingRules',
      timestamp: new Date().toISOString(),
      data: payload
    };
  }
}
