import { HttpExceptionFilter } from './httpexceptionfilter.filter';

describe('HttpExceptionFilter', () => {
  let instance: HttpExceptionFilter;

  beforeEach(() => {
    instance = new HttpExceptionFilter();
  });

  it('should be successfully instantiated', () => {
    expect(instance).toBeDefined();
  });
});
