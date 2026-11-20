import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuditTrailService {
  private readonly logger = new Logger('AuditTrailService');

  async process(payload: Record<string, any>): Promise<Record<string, any>> {
    this.logger.log('Processing in AuditTrailService');
    return {
      status: 'SUCCESS',
      module: 'AuditTrail',
      timestamp: new Date().toISOString(),
      data: payload
    };
  }
}
