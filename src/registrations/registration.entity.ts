import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'registration',
})
export class Registration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  is_fullPass: boolean;

  @Column({
    type: 'jsonb',
    array: true,
    default: () => "'[]'",
    nullable: false,
  })
  workshops: Array<number>;

  @Column()
  status: string;

  @Column()
  festival_id: number;

  @Column()
  user_id: number;
}
