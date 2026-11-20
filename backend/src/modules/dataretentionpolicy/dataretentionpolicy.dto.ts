import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DataRetentionPolicyRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
