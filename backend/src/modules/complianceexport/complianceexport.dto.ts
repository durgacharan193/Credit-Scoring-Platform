import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ComplianceExportRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
