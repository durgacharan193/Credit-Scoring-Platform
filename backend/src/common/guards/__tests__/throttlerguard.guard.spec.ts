import { ThrottlerGuard } from './throttlerguard.guard';

describe('ThrottlerGuard', () => {
  let instance: ThrottlerGuard;

  beforeEach(() => {
    instance = new ThrottlerGuard();
  });

  it('should be successfully instantiated', () => {
    expect(instance).toBeDefined();
  });
});
