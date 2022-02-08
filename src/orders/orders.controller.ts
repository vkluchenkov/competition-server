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
import { Order } from './order.entity';
import { OrdersService } from './orders.service';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OrderDto } from './order.dto';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get(':id')
  async findOne(@Param() params) {
    const isOrder = await this.ordersService.findOne(params.id);

    if (!isOrder) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return await this.ordersService.orderModelToDto(isOrder);
  }

  @Get()
  async findOneByUser(@Req() req): Promise<OrderDto> {
    const isOrder = await this.ordersService.findOneByUser(req.user.id);
    if (!isOrder) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    } else {
      return this.ordersService.orderModelToDto(isOrder);
    }
  }
}
