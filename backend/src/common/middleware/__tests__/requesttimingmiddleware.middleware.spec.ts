import { RequestTimingMiddleware } from './requesttimingmiddleware.middleware';

describe('RequestTimingMiddleware', () => {
  let instance: RequestTimingMiddleware;

  beforeEach(() => {
    instance = new RequestTimingMiddleware();
  });

  it('should be successfully instantiated', () => {
    expect(instance).toBeDefined();
  });
});
