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

  findOne(id: number): Promise<Festival> {
    return this.festivalsRepository.findOne(id);
  }

  findOneByUrl(urlSlug: string): Promise<Festival> {
    return this.festivalsRepository.findOne({
      where: {
        urlSlug,
      },
    });
  }

  findTeachers(): Promise<Teacher[]> {
    return this.teachersRepository.find();
  }

  findWorkshopsByFestival(festivalId: number): Promise<Workshop[]> {
    return this.workshopsRepository.find({
      where: {
        festivalId,
      },
    });
  }

  findOneWorkshop(id: number): Promise<Workshop> {
    return this.workshopsRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.festivalsRepository.delete(id);
  }
}
