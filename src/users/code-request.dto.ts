import { IsEmail, IsNotEmpty } from 'class-validator';

export class CodeRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
