import { RolesGuard } from './rolesguard.guard';

describe('RolesGuard', () => {
  let instance: RolesGuard;

  beforeEach(() => {
    instance = new RolesGuard();
  });

  it('should be successfully instantiated', () => {
    expect(instance).toBeDefined();
  });
});
