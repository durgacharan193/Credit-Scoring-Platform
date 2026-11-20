import { TransformInterceptor } from './transforminterceptor.interceptor';

describe('TransformInterceptor', () => {
  let instance: TransformInterceptor;

  beforeEach(() => {
    instance = new TransformInterceptor();
  });

  it('should be successfully instantiated', () => {
    expect(instance).toBeDefined();
  });
});
