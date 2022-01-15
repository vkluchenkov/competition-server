import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class ResetPassCodeDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6, 6)
  code: string;
}
