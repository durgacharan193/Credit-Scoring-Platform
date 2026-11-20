import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuditTrailRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
