import { AuditLogDecorator } from './auditlogdecorator.decorator';

describe('AuditLogDecorator', () => {
  let instance: AuditLogDecorator;

  beforeEach(() => {
    instance = new AuditLogDecorator();
  });

  it('should be successfully instantiated', () => {
    expect(instance).toBeDefined();
  });
});
