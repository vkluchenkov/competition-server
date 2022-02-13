import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FestivalsService } from './festivals.service';
import { FestivalsController } from './festivals.controller';
import { Festival } from './festival.entity';
import { Workshop } from './workshop.entity';
import { Teacher } from './teacher.entity';
import { Order } from 'src/orders/order.entity';
import { OrdersService } from 'src/orders/orders.service';
import { RegistrationsService } from 'src/registrations/registration.service';
import { Registration } from 'src/registrations/registration.entity';
import { ContestCategories } from 'src/festivals/contestCategories.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Festival,
      Workshop,
      Teacher,
      Order,
      Registration,
      ContestCategories,
    ]),
  ],
  providers: [FestivalsService, OrdersService, RegistrationsService],
  controllers: [FestivalsController],
})
export class FestivalsModule {}
