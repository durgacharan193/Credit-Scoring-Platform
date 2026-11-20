import { KycIntegrationService } from './kycintegration.service';

describe('KycIntegrationService', () => {
  let service: KycIntegrationService;

  beforeEach(() => {
    service = new KycIntegrationService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process request returning success status', async () => {
    const res = await service.process({ id: 'test-123' });
    expect(res.status).toBe('SUCCESS');
    expect(res.module).toBe('KycIntegration');
  });
});
