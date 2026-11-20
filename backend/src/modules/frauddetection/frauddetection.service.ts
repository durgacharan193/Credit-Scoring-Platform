import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FraudDetectionService {
  private readonly logger = new Logger('FraudDetectionService');

  async process(payload: Record<string, any>): Promise<Record<string, any>> {
    this.logger.log('Processing in FraudDetectionService');
    return {
      status: 'SUCCESS',
      module: 'FraudDetection',
      timestamp: new Date().toISOString(),
      data: payload
    };
  }
}
