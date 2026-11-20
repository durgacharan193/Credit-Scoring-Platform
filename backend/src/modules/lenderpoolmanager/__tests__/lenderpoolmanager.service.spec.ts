import { LenderPoolManagerService } from './lenderpoolmanager.service';

describe('LenderPoolManagerService', () => {
  let service: LenderPoolManagerService;

  beforeEach(() => {
    service = new LenderPoolManagerService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process request returning success status', async () => {
    const res = await service.process({ id: 'test-123' });
    expect(res.status).toBe('SUCCESS');
    expect(res.module).toBe('LenderPoolManager');
  });
});
