import { InvoiceFinancingService } from './invoicefinancing.service';

describe('InvoiceFinancingService', () => {
  let service: InvoiceFinancingService;

  beforeEach(() => {
    service = new InvoiceFinancingService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process request returning success status', async () => {
    const res = await service.process({ id: 'test-123' });
    expect(res.status).toBe('SUCCESS');
    expect(res.module).toBe('InvoiceFinancing');
  });
});
