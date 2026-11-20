import { ApiKeyGuard } from './apikeyguard.guard';

describe('ApiKeyGuard', () => {
  let instance: ApiKeyGuard;

  beforeEach(() => {
    instance = new ApiKeyGuard();
  });

  it('should be successfully instantiated', () => {
    expect(instance).toBeDefined();
  });
});
