import { DisputeResolutionService } from './disputeresolution.service';

describe('DisputeResolutionService', () => {
  let service: DisputeResolutionService;

  beforeEach(() => {
    service = new DisputeResolutionService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process request returning success status', async () => {
    const res = await service.process({ id: 'test-123' });
    expect(res.status).toBe('SUCCESS');
    expect(res.module).toBe('DisputeResolution');
  });
});
