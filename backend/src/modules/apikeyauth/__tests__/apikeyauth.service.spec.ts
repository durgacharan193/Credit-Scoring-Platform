import { ApiKeyAuthService } from './apikeyauth.service';

describe('ApiKeyAuthService', () => {
  let service: ApiKeyAuthService;

  beforeEach(() => {
    service = new ApiKeyAuthService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process request returning success status', async () => {
    const res = await service.process({ id: 'test-123' });
    expect(res.status).toBe('SUCCESS');
    expect(res.module).toBe('ApiKeyAuth');
  });
});
