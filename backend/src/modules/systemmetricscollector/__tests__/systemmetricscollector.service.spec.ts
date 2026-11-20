import { SystemMetricsCollectorService } from './systemmetricscollector.service';

describe('SystemMetricsCollectorService', () => {
  let service: SystemMetricsCollectorService;

  beforeEach(() => {
    service = new SystemMetricsCollectorService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process request returning success status', async () => {
    const res = await service.process({ id: 'test-123' });
    expect(res.status).toBe('SUCCESS');
    expect(res.module).toBe('SystemMetricsCollector');
  });
});
