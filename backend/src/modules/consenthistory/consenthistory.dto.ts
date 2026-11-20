import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ConsentHistoryRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
