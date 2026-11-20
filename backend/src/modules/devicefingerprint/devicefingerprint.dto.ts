import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DeviceFingerprintRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
