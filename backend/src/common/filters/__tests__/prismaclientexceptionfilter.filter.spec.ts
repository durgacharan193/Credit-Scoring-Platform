import { PrismaClientExceptionFilter } from './prismaclientexceptionfilter.filter';

describe('PrismaClientExceptionFilter', () => {
  let instance: PrismaClientExceptionFilter;

  beforeEach(() => {
    instance = new PrismaClientExceptionFilter();
  });

  it('should be successfully instantiated', () => {
    expect(instance).toBeDefined();
  });
});
