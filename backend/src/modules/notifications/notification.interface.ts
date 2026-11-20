export interface ISmsMessage {
  to: string;
  message: string;
  metadata?: Record<string, any>;
}

export interface ISmsDeliveryResult {
  messageId: string;
  recipient: string;
  status: 'DELIVERED' | 'FAILED' | 'QUEUED';
  sentAt: Date;
}
