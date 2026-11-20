import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LedgerExportServiceService {
  private readonly logger = new Logger('LedgerExportServiceService');

  async process(payload: Record<string, any>): Promise<Record<string, any>> {
    this.logger.log('Processing in LedgerExportServiceService');
    return {
      status: 'SUCCESS',
      module: 'LedgerExportService',
      timestamp: new Date().toISOString(),
      data: payload
    };
  }
}
