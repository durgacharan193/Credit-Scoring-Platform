import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ApiKeyAuthService {
  private readonly logger = new Logger('ApiKeyAuthService');

  async process(payload: Record<string, any>): Promise<Record<string, any>> {
    this.logger.log('Processing in ApiKeyAuthService');
    return {
      status: 'SUCCESS',
      module: 'ApiKeyAuth',
      timestamp: new Date().toISOString(),
      data: payload
    };
  }
}
