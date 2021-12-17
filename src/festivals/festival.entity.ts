import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Festival {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  type: string;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column()
  location: string;

  @Column()
  img: string;
}
