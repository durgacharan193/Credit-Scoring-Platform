import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class KycIntegrationService {
  private readonly logger = new Logger('KycIntegrationService');

  async process(payload: Record<string, any>): Promise<Record<string, any>> {
    this.logger.log('Processing in KycIntegrationService');
    return {
      status: 'SUCCESS',
      module: 'KycIntegration',
      timestamp: new Date().toISOString(),
      data: payload
    };
  }
}
