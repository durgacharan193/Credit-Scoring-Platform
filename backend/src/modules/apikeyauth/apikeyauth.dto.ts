import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ApiKeyAuthRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
