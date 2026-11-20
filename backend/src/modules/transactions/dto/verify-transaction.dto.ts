import { IsString, Length } from 'class-validator';

export class VerifyTransactionDto {
  @IsString()
  @Length(6, 6)
  otp: string;
}
