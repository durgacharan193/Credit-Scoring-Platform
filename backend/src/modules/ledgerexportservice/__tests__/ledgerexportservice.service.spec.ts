import { LedgerExportServiceService } from './ledgerexportservice.service';

describe('LedgerExportServiceService', () => {
  let service: LedgerExportServiceService;

  beforeEach(() => {
    service = new LedgerExportServiceService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process request returning success status', async () => {
    const res = await service.process({ id: 'test-123' });
    expect(res.status).toBe('SUCCESS');
    expect(res.module).toBe('LedgerExportService');
  });
});
