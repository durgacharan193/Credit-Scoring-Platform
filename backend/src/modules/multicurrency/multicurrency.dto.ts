import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MultiCurrencyRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
