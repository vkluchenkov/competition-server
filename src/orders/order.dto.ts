import { Festival } from 'src/festivals/festival.entity';
import { WorkshopDto } from 'src/festivals/workshop.dto';

interface DtoFestival {
  festival: Festival;
  isFullPass: boolean;
  workshops: WorkshopDto[];
}

export class OrderDto {
  id: number;
  status: string;
  updated_at: Date | null;
  paid_at: Date | null;
  refunded_amount: number | null;
  refunded_at: Date | null;
  created_at: Date | null;
  festivals: DtoFestival[];
}
