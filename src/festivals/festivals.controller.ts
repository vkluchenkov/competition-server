import { Controller, Get } from '@nestjs/common';
import { FestivalsService } from './festivals.service';
import { Festival } from './festival.entity';

@Controller('festivals')
export class FestivalsController {
  constructor(private festivalsService: FestivalsService) {}

  @Get()
  async findAll(): Promise<Festival[]> {
    return this.festivalsService.findAll();
  }
}
