import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LedgerExportServiceRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
