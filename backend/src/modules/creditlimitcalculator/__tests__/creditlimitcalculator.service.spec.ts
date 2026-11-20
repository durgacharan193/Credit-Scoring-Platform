import { CreditLimitCalculatorService } from './creditlimitcalculator.service';

describe('CreditLimitCalculatorService', () => {
  let service: CreditLimitCalculatorService;

  beforeEach(() => {
    service = new CreditLimitCalculatorService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process request returning success status', async () => {
    const res = await service.process({ id: 'test-123' });
    expect(res.status).toBe('SUCCESS');
    expect(res.module).toBe('CreditLimitCalculator');
  });
});
