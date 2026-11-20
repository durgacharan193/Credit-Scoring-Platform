import { SanitizeBodyMiddleware } from './sanitizebodymiddleware.middleware';

describe('SanitizeBodyMiddleware', () => {
  let instance: SanitizeBodyMiddleware;

  beforeEach(() => {
    instance = new SanitizeBodyMiddleware();
  });

  it('should be successfully instantiated', () => {
    expect(instance).toBeDefined();
  });
});
