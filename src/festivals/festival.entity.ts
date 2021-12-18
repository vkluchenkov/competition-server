import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'festivals',
})
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
  description: string;

  @Column()
  img: string;
}
