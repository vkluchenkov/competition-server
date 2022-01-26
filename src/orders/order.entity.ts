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

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @Column()
  paid_at: Date;

  @Column()
  refunded_amount: number;

  @Column()
  refunded_at: Date;

  @Column()
  user_id: string;

  @CreateDateColumn({ default: () => 'NOW()' })
  created_at: Date;
}
