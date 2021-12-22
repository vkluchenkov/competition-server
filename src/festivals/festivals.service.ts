import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Festival } from './festival.entity';
import { Workshops } from './workshops.entity';

@Injectable()
export class FestivalsService {
  constructor(
    @InjectRepository(Festival)
    private festivalsRepository: Repository<Festival>,

    @InjectRepository(Workshops)
    private workshopsRepository: Repository<Workshops>,
  ) {}

  findAll(): Promise<Festival[]> {
    return this.festivalsRepository.find();
  }

  findOne(id: string): Promise<Festival> {
    return this.festivalsRepository.findOne(id);
  }

  findWorkshopsById(festival_id: number): Promise<Workshops[]> {
    return this.workshopsRepository.find({
      where: {
        festival_id,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.festivalsRepository.delete(id);
  }
}
