import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DeviceFingerprintService {
  private readonly logger = new Logger('DeviceFingerprintService');

  async process(payload: Record<string, any>): Promise<Record<string, any>> {
    this.logger.log('Processing in DeviceFingerprintService');
    return {
      status: 'SUCCESS',
      module: 'DeviceFingerprint',
      timestamp: new Date().toISOString(),
      data: payload
    };
  }
}
