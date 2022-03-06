import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'registrations',
})
export class Registration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'is_fullPass' })
  isFullPass: boolean;

  @Column({ name: 'is_soloPass' })
  isSoloPass: boolean;

  @Column({
    type: 'jsonb',
    array: true,
    default: () => "'[]'",
    nullable: false,
  })
  workshops: number[];

  @Column({
    type: 'jsonb',
    array: true,
    default: () => "'[]'",
    nullable: false,
  })
  contest: number[];

  @Column()
  status: string;

  @Column({ name: 'festival_id' })
  festivalId: number;

  @Column({ name: 'user_id' })
  userId: number;
}
