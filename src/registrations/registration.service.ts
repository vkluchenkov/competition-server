import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRegistrationDto } from './create-registration.dto';

import { Registration } from './registration.entity';

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectRepository(Registration)
    private registrationsRepository: Repository<Registration>,
  ) {}

  findAll(): Promise<Registration[]> {
    return this.registrationsRepository.find();
  }

  findOne(id: number): Promise<Registration> {
    return this.registrationsRepository.findOne(id);
  }

  findOneByFestival({ userId, festivalId }): Promise<Registration> {
    return this.registrationsRepository.findOne({
      where: {
        userId,
        festivalId,
      },
    });
  }

  async create(registration: CreateRegistrationDto) {
    return await this.registrationsRepository.save(registration);
  }

  async remove(id: number): Promise<void> {
    await this.registrationsRepository.delete(id);
  }
}
