import { Test, TestingModule } from '@nestjs/testing';
import { SmsService } from '../src/modules/notifications/sms.service';

describe('SmsService', () => {
  let service: SmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmsService],
    }).compile();

    service = module.get<SmsService>(SmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should format and dispatch an OTP verification SMS', async () => {
    const result = await service.sendOtpSms('+919876543210', '123456', 'tx-test-999');

    expect(result.status).toBe('DELIVERED');
    expect(result.recipient).toBe('+919876543210');
    expect(result.messageId).toBeDefined();
  });

  it('should format and dispatch a consent alert SMS', async () => {
    const result = await service.sendConsentAlert('+919876543210', 'Officer Sharma', 'req-555');

    expect(result.status).toBe('DELIVERED');
    expect(result.recipient).toBe('+919876543210');
  });
});
