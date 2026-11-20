import { RateLimitDecorator } from './ratelimitdecorator.decorator';

describe('RateLimitDecorator', () => {
  let instance: RateLimitDecorator;

  beforeEach(() => {
    instance = new RateLimitDecorator();
  });

  it('should be successfully instantiated', () => {
    expect(instance).toBeDefined();
  });
});
