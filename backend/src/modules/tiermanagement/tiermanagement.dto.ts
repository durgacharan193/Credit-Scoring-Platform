import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TierManagementRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
