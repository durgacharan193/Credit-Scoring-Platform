import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FraudDetectionRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
