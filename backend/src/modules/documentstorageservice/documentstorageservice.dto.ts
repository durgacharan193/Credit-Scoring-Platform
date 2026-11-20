import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DocumentStorageServiceRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
