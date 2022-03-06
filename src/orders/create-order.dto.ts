import { Registration } from 'src/registrations/registration.entity';

export class CreateOrderDto {
  userId: number;
  content: Partial<Registration>[];
  status: string;
  paidAt?: string;
  refundedAmount?: number;
  refundedAt?: string;
}
