import { SecurityHeadersMiddleware } from './securityheadersmiddleware.middleware';

describe('SecurityHeadersMiddleware', () => {
  let instance: SecurityHeadersMiddleware;

  beforeEach(() => {
    instance = new SecurityHeadersMiddleware();
  });

  it('should be successfully instantiated', () => {
    expect(instance).toBeDefined();
  });
});
