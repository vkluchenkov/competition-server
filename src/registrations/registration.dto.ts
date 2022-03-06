import { ContestCategories } from 'src/festivals/contestCategories.entity';
import { WorkshopDto } from 'src/festivals/workshop.dto';

export class RegistrationDto {
  id: number;
  isFullPass: boolean;
  isSoloPass: boolean;
  workshops: WorkshopDto[];
  contest: ContestCategories[];
  status: string;
  festivalId: number;
}
