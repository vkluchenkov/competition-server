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
  updatedAt: Date | null;
  paidAt: Date | null;
  refundedAmount: number | null;
  refundedAt: Date | null;
  createdAt: Date | null;
  festivals: DtoFestival[];
}
