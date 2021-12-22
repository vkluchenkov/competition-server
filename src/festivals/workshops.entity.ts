import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'workshops',
})
export class Workshops {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  topic: string;

  @Column()
  start: string;

  @Column()
  end: string;

  @Column()
  price: number;

  @Column()
  festival_id: number;

  @Column()
  teacher_id: string;
}
