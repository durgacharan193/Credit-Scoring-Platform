import { ComplianceExportService } from './complianceexport.service';

describe('ComplianceExportService', () => {
  let service: ComplianceExportService;

  beforeEach(() => {
    service = new ComplianceExportService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process request returning success status', async () => {
    const res = await service.process({ id: 'test-123' });
    expect(res.status).toBe('SUCCESS');
    expect(res.module).toBe('ComplianceExport');
  });
});
