import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RateLimitingRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
