import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InvoiceFinancingRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
