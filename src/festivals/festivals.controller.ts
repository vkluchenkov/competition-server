import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FestivalsService } from './festivals.service';
import { Festival } from './festival.entity';
import { OrderFestivalDto } from './order-festival.dto';
import { WorkshopDto } from './workshop.dto';
import { workshopModelToDto } from './workshopModelToDto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OrdersService } from 'src/orders/orders.service';
import { RegistrationsService } from 'src/registrations/registration.service';
import { ContestCategories } from 'src/festivals/contestCategories.entity';
import { RegistrationDto } from 'src/registrations/registration.dto';
import { request } from 'http';
import { OrderUnregisterFestivalDto } from './order-unregister-festival.dto';

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

  @Get(':id/contest')
  async findContestCatsByFestival(
    @Param() params,
  ): Promise<ContestCategories[]> {
    return await this.festivalsService.findContestCatsByFestival(params.id);
  }

  @Post('register')
  async register(@Body() body: OrderFestivalDto, @Req() req) {
    const newOrder = await this.ordersService.register({
      contentPayload: body,
      userId: req.user.userId,
    });
    if (newOrder) return this.ordersService.orderModelToDto(newOrder);
    return 'Order cancelled or not created due to no changes from current state';
  }

  @Get(':id/registration')
  async findOneByFestival(
    @Param() params,
    @Req() req,
  ): Promise<RegistrationDto> {
    const registration = await this.registrationsService.findOneByFestival({
      userId: req.user.userId,
      festivalId: params.id,
    });

    if (!registration) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return this.registrationsService.registrationModelToDto(registration);
  }
}
