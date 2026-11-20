import { IpWhitelistGuard } from './ipwhitelistguard.guard';

describe('IpWhitelistGuard', () => {
  let instance: IpWhitelistGuard;

  beforeEach(() => {
    instance = new IpWhitelistGuard();
  });

  it('should be successfully instantiated', () => {
    expect(instance).toBeDefined();
  });
});
