import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { FestivalsService } from './festivals.service';
import { Festival } from './festival.entity';
import { RegisterFestivalDto } from './register-festival.dto';
import { WorkshopDto } from './workshop.dto';
import { Teacher } from './teacher.entity';
import { workshopModelToDto } from './workshopModuleToDto';

@Controller('festivals')
export class FestivalsController {
  constructor(private festivalsService: FestivalsService) {}

  @Get()
  async findAll(): Promise<Festival[]> {
    return this.festivalsService.findAll();
  }

  @Get(':url_slug')
  async findOneByUrl(@Param() params): Promise<Festival> {
    const festival = await this.festivalsService.findOneByUrl(params.url_slug);

    if (!festival) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    } else return festival;
  }

  @Get(':id/workshops')
  async findWorkshopsByFestival(@Param() params): Promise<WorkshopDto[]> {
    const workshops = await this.festivalsService.findWorkshopsByFestival(
      params.id,
    );
    const teachers = await this.festivalsService.findTeachers();
    const teacher = (id) => teachers.find((teacher) => teacher.id === id);

    return workshops.map((ws) => workshopModelToDto(ws));
  }

  @Post('register')
  async register(@Body() registerFestivalDto: RegisterFestivalDto) {}
}
