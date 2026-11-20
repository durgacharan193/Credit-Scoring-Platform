import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CibilScoreAdapterService {
  private readonly logger = new Logger('CibilScoreAdapterService');

  async process(payload: Record<string, any>): Promise<Record<string, any>> {
    this.logger.log('Processing in CibilScoreAdapterService');
    return {
      status: 'SUCCESS',
      module: 'CibilScoreAdapter',
      timestamp: new Date().toISOString(),
      data: payload
    };
  }
}
