import { OrderFestivalDto } from 'src/festivals/order-festival.dto';

export class OrderRegisterDto {
  contentPayload: OrderFestivalDto;
  userId: number;
}
