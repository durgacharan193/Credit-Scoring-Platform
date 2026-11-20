import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationQueueService {
  private readonly logger = new Logger('NotificationQueueService');

  async process(payload: Record<string, any>): Promise<Record<string, any>> {
    this.logger.log('Processing in NotificationQueueService');
    return {
      status: 'SUCCESS',
      module: 'NotificationQueue',
      timestamp: new Date().toISOString(),
      data: payload
    };
  }
}
