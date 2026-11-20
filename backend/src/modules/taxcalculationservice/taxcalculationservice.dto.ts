import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TaxCalculationServiceRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
