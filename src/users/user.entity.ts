import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ name: 'password_reset' })
  passwordReset: string;

  @Column()
  name: string;

  @Column({ name: 'birth_date' })
  birthDate: string;
}
