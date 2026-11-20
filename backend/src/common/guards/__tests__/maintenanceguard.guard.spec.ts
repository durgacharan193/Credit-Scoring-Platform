import { MaintenanceGuard } from './maintenanceguard.guard';

describe('MaintenanceGuard', () => {
  let instance: MaintenanceGuard;

  beforeEach(() => {
    instance = new MaintenanceGuard();
  });

  it('should be successfully instantiated', () => {
    expect(instance).toBeDefined();
  });
});
