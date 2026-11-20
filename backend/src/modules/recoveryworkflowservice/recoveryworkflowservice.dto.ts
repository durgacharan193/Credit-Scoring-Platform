import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RecoveryWorkflowServiceRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
