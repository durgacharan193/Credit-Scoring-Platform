import { OpenTelemetryService } from './opentelemetry.service';

describe('OpenTelemetryService', () => {
  let service: OpenTelemetryService;

  beforeEach(() => {
    service = new OpenTelemetryService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process request returning success status', async () => {
    const res = await service.process({ id: 'test-123' });
    expect(res.status).toBe('SUCCESS');
    expect(res.module).toBe('OpenTelemetry');
  });
});
