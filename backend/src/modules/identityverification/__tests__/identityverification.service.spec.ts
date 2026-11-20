import { IdentityVerificationService } from './identityverification.service';

describe('IdentityVerificationService', () => {
  let service: IdentityVerificationService;

  beforeEach(() => {
    service = new IdentityVerificationService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process request returning success status', async () => {
    const res = await service.process({ id: 'test-123' });
    expect(res.status).toBe('SUCCESS');
    expect(res.module).toBe('IdentityVerification');
  });
});
