import { ValidationExceptionFilter } from './validationexceptionfilter.filter';

describe('ValidationExceptionFilter', () => {
  let instance: ValidationExceptionFilter;

  beforeEach(() => {
    instance = new ValidationExceptionFilter();
  });

  it('should be successfully instantiated', () => {
    expect(instance).toBeDefined();
  });
});
