import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BatchSettlementRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
