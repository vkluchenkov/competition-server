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
    const isOrder = await this.ordersService.findOne(params.id);

    if (!isOrder) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return await this.ordersService.orderModelToDto(isOrder);
  }

  @Get()
  async findOneByUser(@Req() req): Promise<OrderDto> {
    const isOrder = await this.ordersService.findOneByUser(req.user.userId);
    if (!isOrder) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return this.ordersService.orderModelToDto(isOrder);
  }

  @Post('pay')
  async pay(@Body() body: PayOrderDto, @Req() req) {
    const isOrder = await this.ordersService.findOneByUser(req.user.userId);
    if (!isOrder) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const payment = await this.ordersService.pay(isOrder);

    return this.ordersService.orderModelToDto(payment);
  }
}
