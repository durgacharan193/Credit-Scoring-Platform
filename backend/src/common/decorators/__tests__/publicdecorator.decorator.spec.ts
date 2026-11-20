import { PublicDecorator } from './publicdecorator.decorator';

describe('PublicDecorator', () => {
  let instance: PublicDecorator;

  beforeEach(() => {
    instance = new PublicDecorator();
  });

  it('should be successfully instantiated', () => {
    expect(instance).toBeDefined();
  });
});
