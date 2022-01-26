import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Festival } from 'src/festivals/festival.entity';
import { FestivalsService } from 'src/festivals/festivals.service';
import { Teacher } from 'src/festivals/teacher.entity';
import { Workshop } from 'src/festivals/workshop.entity';
import { Order } from './order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    TypeOrmModule.forFeature([Festival]),
    TypeOrmModule.forFeature([Workshop]),
    TypeOrmModule.forFeature([Teacher]),
  ],
  providers: [OrdersService, FestivalsService],
  controllers: [OrdersController],
})
export class OrdersModule {}
