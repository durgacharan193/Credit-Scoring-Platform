import { CurrentUserDecorator } from './currentuserdecorator.decorator';

describe('CurrentUserDecorator', () => {
  let instance: CurrentUserDecorator;

  beforeEach(() => {
    instance = new CurrentUserDecorator();
  });

  it('should be successfully instantiated', () => {
    expect(instance).toBeDefined();
  });
});
