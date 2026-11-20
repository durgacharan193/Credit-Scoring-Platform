import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DisputeResolutionRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
