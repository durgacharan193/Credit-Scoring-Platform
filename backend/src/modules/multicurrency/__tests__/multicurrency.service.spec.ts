import { MultiCurrencyService } from './multicurrency.service';

describe('MultiCurrencyService', () => {
  let service: MultiCurrencyService;

  beforeEach(() => {
    service = new MultiCurrencyService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process request returning success status', async () => {
    const res = await service.process({ id: 'test-123' });
    expect(res.status).toBe('SUCCESS');
    expect(res.module).toBe('MultiCurrency');
  });
});
