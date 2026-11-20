import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EscrowServiceRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
