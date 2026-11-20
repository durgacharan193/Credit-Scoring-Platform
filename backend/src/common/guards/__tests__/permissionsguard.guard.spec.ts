import { PermissionsGuard } from './permissionsguard.guard';

describe('PermissionsGuard', () => {
  let instance: PermissionsGuard;

  beforeEach(() => {
    instance = new PermissionsGuard();
  });

  it('should be successfully instantiated', () => {
    expect(instance).toBeDefined();
  });
});
