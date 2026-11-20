import { TimeoutInterceptor } from './timeoutinterceptor.interceptor';

describe('TimeoutInterceptor', () => {
  let instance: TimeoutInterceptor;

  beforeEach(() => {
    instance = new TimeoutInterceptor();
  });

  it('should be successfully instantiated', () => {
    expect(instance).toBeDefined();
  });
});
