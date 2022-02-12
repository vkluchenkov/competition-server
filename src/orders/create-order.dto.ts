import { Registration } from 'src/registrations/registration.entity';

export class CreateOrderDto {
  userId: string;
  content: Partial<Registration>[];
  status: string;
  paidAt?: string;
  refundedAmount?: number;
  refundedAt?: string;
}
