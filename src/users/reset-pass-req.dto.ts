import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPassReqDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
