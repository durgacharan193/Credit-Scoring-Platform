import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class KycIntegrationRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
