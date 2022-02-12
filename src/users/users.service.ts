import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  incompleteSignUps = {};

  generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  userModelToDto = ({ password, passwordReset, ...rest }: User) => {
    return { ...rest };
  };

  async create(user: User) {
    await this.usersRepository.save(user);
  }

  async update({ userId, ...rest }: User) {
    await this.usersRepository.update(userId, { ...rest });
  }

  findOneById(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  findOneByEmailAndPass(email: string, password: string): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        email,
        password,
      },
    });
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
