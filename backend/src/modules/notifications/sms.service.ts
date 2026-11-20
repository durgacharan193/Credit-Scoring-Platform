import { Injectable, Logger } from '@nestjs/common';
import { ISmsMessage, ISmsDeliveryResult } from './notification.interface';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  /**
   * Dispatches OTP verification SMS to counterparties
   */
  async sendOtpSms(phone: string, otp: string, transactionId: string): Promise<ISmsDeliveryResult> {
    const message = `[CreditPlatform] Your verification code is ${otp} for transaction #${transactionId.slice(0, 8)}. Valid for 10 minutes. Do not share.`;
    
    return this.deliverSms({
      to: phone,
      message,
      metadata: { transactionId, type: 'OTP_VERIFICATION' },
    });
  }

  /**
   * Dispatches Consent alert SMS to borrowers
   */
  async sendConsentAlert(phone: string, officerName: string, consentId: string): Promise<ISmsDeliveryResult> {
    const message = `[CreditPlatform] Bank Officer ${officerName} has requested access to your credit score (Req #${consentId.slice(0, 6)}). Approve on dashboard.`;

    return this.deliverSms({
      to: phone,
      message,
      metadata: { consentId, type: 'CONSENT_ALERT' },
    });
  }

  private async deliverSms(sms: ISmsMessage): Promise<ISmsDeliveryResult> {
    this.logger.log(`Dispatching SMS to ${sms.to}: "${sms.message}"`);
    
    // In production, integrate with Twilio or AWS SNS SDK
    // In local/sandbox, log and simulate successful queue delivery
    const result: ISmsDeliveryResult = {
      messageId: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      recipient: sms.to,
      status: 'DELIVERED',
      sentAt: new Date(),
    };

    return result;
  }
}
