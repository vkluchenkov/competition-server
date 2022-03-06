import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
