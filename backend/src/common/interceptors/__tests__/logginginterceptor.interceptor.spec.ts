import { LoggingInterceptor } from './logginginterceptor.interceptor';

describe('LoggingInterceptor', () => {
  let instance: LoggingInterceptor;

  beforeEach(() => {
    instance = new LoggingInterceptor();
  });

  it('should be successfully instantiated', () => {
    expect(instance).toBeDefined();
  });
});
