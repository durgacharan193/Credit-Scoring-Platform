import { CacheInterceptor } from './cacheinterceptor.interceptor';

describe('CacheInterceptor', () => {
  let instance: CacheInterceptor;

  beforeEach(() => {
    instance = new CacheInterceptor();
  });

  it('should be successfully instantiated', () => {
    expect(instance).toBeDefined();
  });
});
