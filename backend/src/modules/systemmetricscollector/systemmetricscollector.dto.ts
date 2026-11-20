import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SystemMetricsCollectorRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
