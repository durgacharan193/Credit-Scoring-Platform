import { JwtAuthGuard } from './jwtauthguard.guard';

describe('JwtAuthGuard', () => {
  let instance: JwtAuthGuard;

  beforeEach(() => {
    instance = new JwtAuthGuard();
  });

  it('should be successfully instantiated', () => {
    expect(instance).toBeDefined();
  });
});
