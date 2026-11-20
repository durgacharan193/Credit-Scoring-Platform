import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DocumentStorageServiceService {
  private readonly logger = new Logger('DocumentStorageServiceService');

  async process(payload: Record<string, any>): Promise<Record<string, any>> {
    this.logger.log('Processing in DocumentStorageServiceService');
    return {
      status: 'SUCCESS',
      module: 'DocumentStorageService',
      timestamp: new Date().toISOString(),
      data: payload
    };
  }
}
