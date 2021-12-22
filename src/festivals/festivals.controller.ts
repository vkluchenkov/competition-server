import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FestivalsService } from './festivals.service';
import { Festival } from './festival.entity';
import { Workshops } from './workshops.entity';
import { RegisterFestivalDto } from './register-festival.dto';

@Controller('festivals')
export class FestivalsController {
  constructor(private festivalsService: FestivalsService) {}

  @Get()
  async findAll(): Promise<Festival[]> {
    return this.festivalsService.findAll();
  }

  @Get(':id/workshops')
  async findWorkshopsById(@Param() params): Promise<Workshops[]> {
    return this.festivalsService.findWorkshopsById(params.id);
  }

  @Post('register')
  async register(@Body() registerFestivalDto: RegisterFestivalDto) {}
}
