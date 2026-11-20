import { EscrowServiceService } from './escrowservice.service';

describe('EscrowServiceService', () => {
  let service: EscrowServiceService;

  beforeEach(() => {
    service = new EscrowServiceService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process request returning success status', async () => {
    const res = await service.process({ id: 'test-123' });
    expect(res.status).toBe('SUCCESS');
    expect(res.module).toBe('EscrowService');
  });
});
