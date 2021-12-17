import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Festival } from './festival.entity';

@Injectable()
export class FestivalsService {
  constructor(
    @InjectRepository(Festival)
    private festivalsRepository: Repository<Festival>,
  ) {}

  findAll(): Promise<Festival[]> {
    return this.festivalsRepository.find();
  }

  findOne(id: string): Promise<Festival> {
    return this.festivalsRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.festivalsRepository.delete(id);
  }
}
