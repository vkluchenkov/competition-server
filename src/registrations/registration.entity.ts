import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'registrations',
})
export class Registration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  is_fullPass: boolean;

  @Column()
  is_soloPass: boolean;

  @Column({
    type: 'jsonb',
    array: true,
    default: () => "'[]'",
    nullable: false,
  })
  workshops: Array<number>;

  @Column({
    type: 'jsonb',
    array: true,
    default: () => "'[]'",
    nullable: false,
  })
  contest: Array<number>;

  @Column()
  status: string;

  @Column()
  festival_id: number;

  @Column()
  user_id: number;
}
