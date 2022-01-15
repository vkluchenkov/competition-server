import { IsNotEmpty, IsNumber } from 'class-validator';

export class TeacherDto {
  @IsNumber()
  id: number;

  @IsNotEmpty()
  name: string;

  @IsNumber()
  sort_order: number;
}
