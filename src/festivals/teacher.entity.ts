import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'teachers',
})
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  sort_order: number;
}
