import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class HealthCheckRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
