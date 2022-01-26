import { Registration } from 'src/registrations/registration.entity';

export class CreateOrderDto {
  user_id: string;
  content: Partial<Registration>[];
  status: string;
  paid_at?: string;
  refunded_amount?: number;
  refunded_at?: string;
}
