import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'teachers',
})
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'sort_order' })
  sortOrder: number;
}
