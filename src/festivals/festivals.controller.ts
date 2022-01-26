import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FestivalsService } from './festivals.service';
import { Festival } from './festival.entity';
import { RegisterFestivalDto } from './register-festival.dto';
import { WorkshopDto } from './workshop.dto';
import { workshopModelToDto } from './workshopModeleToDto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OrdersService } from 'src/orders/orders.service';
import { Order } from 'src/orders/order.entity';

@UseGuards(JwtAuthGuard)
@Controller('festivals')
export class FestivalsController {
  constructor(
    private festivalsService: FestivalsService,
    private ordersService: OrdersService,
  ) {}

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

  @Get(':id/data')
  async findOneById(@Param() params): Promise<Festival> {
    const festival = await this.festivalsService.findOne(params.id);

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

    return workshops.map((ws) => workshopModelToDto(ws, teacher));
  }

  @Post('register')
  async register(
    @Body() { workshops, isFullPass, festival_id }: RegisterFestivalDto,
    @Req() req,
  ) {
    const registrationDtoToModel = {
      content: {
        workshops,
        is_fullPass: isFullPass,
        festival_id,
      },
      user_id: req.user.id,
    };

    return this.ordersService.orderModelToDto(
      await this.ordersService.register(registrationDtoToModel),
    );
  }
}
