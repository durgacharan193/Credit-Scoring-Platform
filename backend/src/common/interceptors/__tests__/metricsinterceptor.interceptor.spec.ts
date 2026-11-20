import { MetricsInterceptor } from './metricsinterceptor.interceptor';

describe('MetricsInterceptor', () => {
  let instance: MetricsInterceptor;

  beforeEach(() => {
    instance = new MetricsInterceptor();
  });

  it('should be successfully instantiated', () => {
    expect(instance).toBeDefined();
  });
});
