import { IdempotencyMiddleware } from './idempotencymiddleware.middleware';

describe('IdempotencyMiddleware', () => {
  let instance: IdempotencyMiddleware;

  beforeEach(() => {
    instance = new IdempotencyMiddleware();
  });

  it('should be successfully instantiated', () => {
    expect(instance).toBeDefined();
  });
});
