import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Festival } from './festival.entity';
import { Workshop } from './workshop.entity';
import { Teacher } from './teacher.entity';

@Injectable()
export class FestivalsService {
  constructor(
    @InjectRepository(Festival)
    private festivalsRepository: Repository<Festival>,

    @InjectRepository(Workshop)
    private workshopsRepository: Repository<Workshop>,

    @InjectRepository(Teacher)
    private teachersRepository: Repository<Teacher>,
  ) {}

  findAll(): Promise<Festival[]> {
    return this.festivalsRepository.find();
  }

  findOne(id: string): Promise<Festival> {
    return this.festivalsRepository.findOne(id);
  }

  findOneByUrl(url_slug: string): Promise<Festival> {
    return this.festivalsRepository.findOne({
      where: {
        url_slug,
      },
    });
  }

  findTeachers(): Promise<Teacher[]> {
    return this.teachersRepository.find();
  }

  findWorkshopsByFestival(festival_id: number): Promise<Workshop[]> {
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
