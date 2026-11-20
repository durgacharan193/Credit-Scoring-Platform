import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LenderPoolManagerRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
