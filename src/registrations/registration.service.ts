import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FestivalsService } from 'src/festivals/festivals.service';
import { workshopModelToDto } from 'src/festivals/workshopModelToDto';
import { Repository } from 'typeorm';
import { CreateRegistrationDto } from './create-registration.dto';
import { RegistrationDto } from './registration.dto';
import { Registration } from './registration.entity';

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectRepository(Registration)
    private registrationsRepository: Repository<Registration>,
    private festivalsService: FestivalsService,
  ) {}

  registrationModelToDto = async ({
    userId,
    contest,
    workshops,
    festivalId,
    ...rest
  }: Registration): Promise<RegistrationDto> => {
    const festivalWorkshops =
      await this.festivalsService.findWorkshopsByFestival(festivalId);

    const filteredWs = festivalWorkshops.filter((ws) => {
      if (workshops) {
        return workshops.includes(ws.id);
      }
    });

    const teachers = await this.festivalsService.findTeachers();
    const teacher = (id) => teachers.find((teacher) => teacher.id === id);

    const wsWithTeachers = filteredWs.map((ws) =>
      workshopModelToDto(ws, teacher),
    );

    const festivalContestCats =
      await this.festivalsService.findContestCatsByFestival(festivalId);

    const filteredContestCats = festivalContestCats.filter((category) => {
      if (contest) {
        return contest.includes(category.id);
      }
    });

    return {
      contest: filteredContestCats,
      workshops: wsWithTeachers,
      festivalId,
      ...rest,
    };
  };

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
