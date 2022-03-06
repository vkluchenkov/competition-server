import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Registration } from 'src/registrations/registration.entity';

@Entity({
  name: 'orders',
})
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'jsonb',
    array: true,
    default: () => "'[]'",
    nullable: false,
  })
  content: Partial<Registration>[];

  @Column()
  status: string;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'paid_at' })
  paidAt: Date;

  @Column({ name: 'refunded_amount' })
  refundedAmount: number;

  @Column({ name: 'refunded_at' })
  refundedAt: Date;

  @Column({ name: 'user_id' })
  userId: number;

  @CreateDateColumn({ name: 'created_at', default: () => 'NOW()' })
  createdAt: Date;
}
