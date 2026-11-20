import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BlacklistServiceRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
