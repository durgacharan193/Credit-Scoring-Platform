import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class WebhookDispatcherRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
