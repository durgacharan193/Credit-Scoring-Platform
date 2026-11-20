import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RepaymentSchedulerRequestDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
