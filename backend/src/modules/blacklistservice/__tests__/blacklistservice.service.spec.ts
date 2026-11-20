import { BlacklistServiceService } from './blacklistservice.service';

describe('BlacklistServiceService', () => {
  let service: BlacklistServiceService;

  beforeEach(() => {
    service = new BlacklistServiceService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process request returning success status', async () => {
    const res = await service.process({ id: 'test-123' });
    expect(res.status).toBe('SUCCESS');
    expect(res.module).toBe('BlacklistService');
  });
});
