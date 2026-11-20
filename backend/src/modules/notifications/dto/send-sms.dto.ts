import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class SendOtpSmsDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Phone number must be a valid E.164 format' })
  phone: string;

  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsString()
  @IsNotEmpty()
  transactionId: string;
}
