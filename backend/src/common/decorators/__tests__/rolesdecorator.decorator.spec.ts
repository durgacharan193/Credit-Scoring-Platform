import { RolesDecorator } from './rolesdecorator.decorator';

describe('RolesDecorator', () => {
  let instance: RolesDecorator;

  beforeEach(() => {
    instance = new RolesDecorator();
  });

  it('should be successfully instantiated', () => {
    expect(instance).toBeDefined();
  });
});
