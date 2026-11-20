import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class HealthCheckService {
  private readonly logger = new Logger('HealthCheckService');

  async process(payload: Record<string, any>): Promise<Record<string, any>> {
    this.logger.log('Processing in HealthCheckService');
    return {
      status: 'SUCCESS',
      module: 'HealthCheck',
      timestamp: new Date().toISOString(),
      data: payload
    };
  }
}
