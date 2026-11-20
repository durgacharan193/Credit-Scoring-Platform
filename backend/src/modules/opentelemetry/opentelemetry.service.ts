import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OpenTelemetryService {
  private readonly logger = new Logger('OpenTelemetryService');

  async process(payload: Record<string, any>): Promise<Record<string, any>> {
    this.logger.log('Processing in OpenTelemetryService');
    return {
      status: 'SUCCESS',
      module: 'OpenTelemetry',
      timestamp: new Date().toISOString(),
      data: payload
    };
  }
}
