import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'workshops',
})
export class Workshop {
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

  @Column({ name: 'festival_id' })
  festivalId: number;

  @Column({ name: 'teacher_id' })
  teacherId: string;

  @Column()
  limit: number;

  @Column()
  counter: number;
}
