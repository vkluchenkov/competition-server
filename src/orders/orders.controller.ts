import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OrderDto } from './order.dto';
import { PayOrderDto } from './pay-order.dto';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get(':id')
  async findOne(@Param() params) {
    const order = await this.ordersService.findOne(params.id);

    if (!order) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return await this.ordersService.orderModelToDto(order);
  }

  @Get()
  async findOneByUser(@Req() req): Promise<OrderDto> {
    const order = await this.ordersService.findOneByUser(req.user.userId);
    if (!order || order.status === 'paid') {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return this.ordersService.orderModelToDto(order);
  }

  @Post('pay')
  async pay(@Body() body: PayOrderDto, @Req() req) {
    const order = await this.ordersService.findOneByUser(req.user.userId);
    if (!order) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const payment = await this.ordersService.pay(order);

    return this.ordersService.orderModelToDto(payment);
  }
}
