import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FestivalsService } from './festivals.service';
import { Festival } from './festival.entity';
import { RegisterFestivalDto } from './register-festival.dto';
import { WorkshopDto } from './workshop.dto';
import { Teacher } from './teacher.entity';
import { Workshop } from './workshop.entity';

@Controller('festivals')
export class FestivalsController {
  constructor(private festivalsService: FestivalsService) {}

  @Get()
  async findAll(): Promise<Festival[]> {
    return this.festivalsService.findAll();
  }

  @Get(':url_slug')
  async findOneByUrl(@Param() params): Promise<Festival> {
    return this.festivalsService.findOneByUrl(params.url_slug);
  }

  @Get(':id/workshops')
  async findWorkshopsByFestival(@Param() params): Promise<WorkshopDto[]> {
    const workshops = await this.festivalsService.findWorkshopsByFestival(
      params.id,
    );
    const teachers = await this.festivalsService.findTeachers();
    const teacher = (id) => teachers.find((teacher) => teacher.id === id);

    const workshopModelToDto = (workshopEntity: Workshop) => {
      return {
        id: workshopEntity.id,
        topic: workshopEntity.topic,
        start: workshopEntity.start,
        end: workshopEntity.end,
        price: workshopEntity.price,
        teacher: teacher(workshopEntity.teacher_id),
      };
    };

    return workshops.map((ws) => workshopModelToDto(ws));
  }

  @Post('register')
  async register(@Body() registerFestivalDto: RegisterFestivalDto) {}
}
