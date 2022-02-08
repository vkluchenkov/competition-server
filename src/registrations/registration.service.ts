import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Registration } from './registration.entity';

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectRepository(Registration)
    private RegistrationsRepository: Repository<Registration>,
  ) {}

  findAll(): Promise<Registration[]> {
    return this.RegistrationsRepository.find();
  }

  findOne(id: number): Promise<Registration> {
    return this.RegistrationsRepository.findOne(id);
  }

  findOneByFestival({ user_id, festival_id }): Promise<Registration> {
    return this.RegistrationsRepository.findOne({
      where: {
        user_id,
        festival_id,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.RegistrationsRepository.delete(id);
  }
}
