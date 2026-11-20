import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import * as amqplib from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: any;
  private channel: any;

  private readonly EXCHANGE = 'credit.events';
  private readonly QUEUE = 'transaction.verified';
  private readonly ROUTING_KEY = 'transaction.verified';

  async onModuleInit() {
    try {
      const url = process.env.RABBITMQ_URL || 'amqp://credituser:creditpass@localhost:5672';
      this.connection = await amqplib.connect(url);
      this.channel = await this.connection.createChannel();

      await this.channel.assertExchange(this.EXCHANGE, 'topic', { durable: true });
      await this.channel.assertQueue(this.QUEUE, { durable: true });
      await this.channel.bindQueue(this.QUEUE, this.EXCHANGE, this.ROUTING_KEY);

      this.logger.log('RabbitMQ connected and exchange/queue configured');
    } catch (err) {
      this.logger.warn(`RabbitMQ connection failed (non-fatal): ${err.message}`);
    }
  }

  async onModuleDestroy() {
    try {
      await this.channel?.close();
      await this.connection?.close();
    } catch (_) {}
  }

  async publishTransactionVerified(payload: object): Promise<void> {
    try {
      if (!this.channel) {
        this.logger.warn('RabbitMQ channel not available, skipping publish');
        return;
      }
      const content = Buffer.from(JSON.stringify(payload));
      this.channel.publish(this.EXCHANGE, this.ROUTING_KEY, content, {
        persistent: true,
        contentType: 'application/json',
      });
    } catch (err) {
      this.logger.error(`Failed to publish event: ${err.message}`);
    }
  }
}
