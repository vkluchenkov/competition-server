import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'registration',
})
export class Registration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  is_fullpass: boolean;

  @Column({
    type: 'jsonb',
    array: true,
    default: () => "'[]'",
    nullable: false,
  })
  workshops: Array<{ workshop_id: number }>;

  @Column()
  status: string;

  @Column()
  festival_id: string;

  @Column()
  user_id: number;
}
