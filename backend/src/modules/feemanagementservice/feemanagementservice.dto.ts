import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FeeManagementServiceRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
