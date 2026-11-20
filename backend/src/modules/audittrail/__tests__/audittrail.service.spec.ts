import { AuditTrailService } from './audittrail.service';

describe('AuditTrailService', () => {
  let service: AuditTrailService;

  beforeEach(() => {
    service = new AuditTrailService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process request returning success status', async () => {
    const res = await service.process({ id: 'test-123' });
    expect(res.status).toBe('SUCCESS');
    expect(res.module).toBe('AuditTrail');
  });
});
