import { UnderwritingRulesService } from './underwritingrules.service';

describe('UnderwritingRulesService', () => {
  let service: UnderwritingRulesService;

  beforeEach(() => {
    service = new UnderwritingRulesService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process request returning success status', async () => {
    const res = await service.process({ id: 'test-123' });
    expect(res.status).toBe('SUCCESS');
    expect(res.module).toBe('UnderwritingRules');
  });
});
