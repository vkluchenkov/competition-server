import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'contest_cats',
})
export class ContestCategories {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  price: number;

  @Column()
  priceFullPass: number;

  @Column()
  festivalId: number;
}
