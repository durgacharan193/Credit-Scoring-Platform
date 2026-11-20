import { RiskAssessmentService } from './riskassessment.service';

describe('RiskAssessmentService', () => {
  let service: RiskAssessmentService;

  beforeEach(() => {
    service = new RiskAssessmentService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process request returning success status', async () => {
    const res = await service.process({ id: 'test-123' });
    expect(res.status).toBe('SUCCESS');
    expect(res.module).toBe('RiskAssessment');
  });
});
