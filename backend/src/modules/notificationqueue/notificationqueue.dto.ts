import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class NotificationQueueRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
