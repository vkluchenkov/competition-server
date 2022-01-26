import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Order } from './order.entity';
import { OrdersService } from './orders.service';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get(':order_id')
  async findOne(@Param() params) {
    const order = await this.ordersService.findOne(params.id);

    if (!order) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return await this.ordersService.orderModelToDto(order);
  }
}
