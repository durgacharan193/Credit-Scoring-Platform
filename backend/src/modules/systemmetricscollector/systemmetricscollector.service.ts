import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SystemMetricsCollectorService {
  private readonly logger = new Logger('SystemMetricsCollectorService');

  async process(payload: Record<string, any>): Promise<Record<string, any>> {
    this.logger.log('Processing in SystemMetricsCollectorService');
    return {
      status: 'SUCCESS',
      module: 'SystemMetricsCollector',
      timestamp: new Date().toISOString(),
      data: payload
    };
  }
}
