import { CorrelationIdMiddleware } from './correlationidmiddleware.middleware';

describe('CorrelationIdMiddleware', () => {
  let instance: CorrelationIdMiddleware;

  beforeEach(() => {
    instance = new CorrelationIdMiddleware();
  });

  it('should be successfully instantiated', () => {
    expect(instance).toBeDefined();
  });
});
