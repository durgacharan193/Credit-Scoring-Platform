import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AccountAggregatorRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
