import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ConsentHistoryService {
  private readonly logger = new Logger('ConsentHistoryService');

  async process(payload: Record<string, any>): Promise<Record<string, any>> {
    this.logger.log('Processing in ConsentHistoryService');
    return {
      status: 'SUCCESS',
      module: 'ConsentHistory',
      timestamp: new Date().toISOString(),
      data: payload
    };
  }
}
