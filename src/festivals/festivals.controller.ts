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
import { OrderFestivalDto } from './order-festival.dto';
import { WorkshopDto } from './workshop.dto';
import { workshopModelToDto } from './workshopModeleToDto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OrdersService } from 'src/orders/orders.service';
import { RegistrationsService } from 'src/registrations/registration.service';
import { Registration } from 'src/registrations/registration.entity';

@UseGuards(JwtAuthGuard)
@Controller('festivals')
export class FestivalsController {
  constructor(
    private festivalsService: FestivalsService,
    private ordersService: OrdersService,
    private registrationsService: RegistrationsService,
  ) {}

  @Get()
  async findAll(): Promise<Festival[]> {
    return this.festivalsService.findAll();
  }

  @Get(':urlSlug')
  async findOneByUrl(@Param() params): Promise<Festival> {
    const festival = await this.festivalsService.findOneByUrl(params.urlSlug);

    if (!festival) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return festival;
  }

  @Get(':id/data')
  async findOneById(@Param() params): Promise<Festival> {
    const festival = await this.festivalsService.findOne(params.id);

    if (!festival) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return festival;
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
  async register(@Body() body: OrderFestivalDto, @Req() req) {
    const orderDtoToModel = {
      newContent: body,
      userId: req.user.userId,
    };

    return this.ordersService.orderModelToDto(
      await this.ordersService.register(orderDtoToModel),
    );
  }

  @Get(':id/registration')
  async findOneByFestival(@Param() params, @Req() req): Promise<Registration> {
    const registration = await this.registrationsService.findOneByFestival({
      userId: req.user.userId,
      festivalId: params.id,
    });

    if (!registration) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return registration;
  }
}
