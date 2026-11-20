import { BatchSettlementService } from './batchsettlement.service';

describe('BatchSettlementService', () => {
  let service: BatchSettlementService;

  beforeEach(() => {
    service = new BatchSettlementService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process request returning success status', async () => {
    const res = await service.process({ id: 'test-123' });
    expect(res.status).toBe('SUCCESS');
    expect(res.module).toBe('BatchSettlement');
  });
});
