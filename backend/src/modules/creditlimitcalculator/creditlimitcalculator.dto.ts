import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreditLimitCalculatorRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
