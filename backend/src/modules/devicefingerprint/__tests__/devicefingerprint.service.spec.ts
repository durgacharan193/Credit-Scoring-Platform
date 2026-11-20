import { DeviceFingerprintService } from './devicefingerprint.service';

describe('DeviceFingerprintService', () => {
  let service: DeviceFingerprintService;

  beforeEach(() => {
    service = new DeviceFingerprintService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process request returning success status', async () => {
    const res = await service.process({ id: 'test-123' });
    expect(res.status).toBe('SUCCESS');
    expect(res.module).toBe('DeviceFingerprint');
  });
});
