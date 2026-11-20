import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CibilScoreAdapterRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
