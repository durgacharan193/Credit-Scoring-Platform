import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class OpenTelemetryRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
