import { RateLimitingService } from './ratelimiting.service';

describe('RateLimitingService', () => {
  let service: RateLimitingService;

  beforeEach(() => {
    service = new RateLimitingService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process request returning success status', async () => {
    const res = await service.process({ id: 'test-123' });
    expect(res.status).toBe('SUCCESS');
    expect(res.module).toBe('RateLimiting');
  });
});
