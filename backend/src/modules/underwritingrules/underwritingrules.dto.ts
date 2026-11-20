import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UnderwritingRulesRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
