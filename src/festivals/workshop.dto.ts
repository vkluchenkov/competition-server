import { TeacherDto } from './teacher.dto';

export class WorkshopDto {
  id: number;
  topic: string;
  start: string;
  end: string;
  price: number;
  teacher: TeacherDto;
}
