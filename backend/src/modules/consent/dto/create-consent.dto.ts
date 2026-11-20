import { IsUUID } from 'class-validator';

export class CreateConsentDto {
  @IsUUID()
  borrowerId: string;
}
