import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class IdentityVerificationRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
