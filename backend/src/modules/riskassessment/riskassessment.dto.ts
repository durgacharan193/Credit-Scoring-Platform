import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RiskAssessmentRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
