import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WebhookDispatcherService {
  private readonly logger = new Logger('WebhookDispatcherService');

  async process(payload: Record<string, any>): Promise<Record<string, any>> {
    this.logger.log('Processing in WebhookDispatcherService');
    return {
      status: 'SUCCESS',
      module: 'WebhookDispatcher',
      timestamp: new Date().toISOString(),
      data: payload
    };
  }
}
