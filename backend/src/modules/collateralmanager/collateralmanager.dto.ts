import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CollateralManagerRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
