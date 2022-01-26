import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type } from 'os';
import { Festival } from 'src/festivals/festival.entity';
import { FestivalsService } from 'src/festivals/festivals.service';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './create-order.dto';
import { OrderDto } from './order.dto';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,

    private festivalsService: FestivalsService,
  ) {}

  orderModelToDto = async ({
    user_id,
    content,
    ...rest
  }: Order): Promise<OrderDto> => {
    const festivals = await Promise.all(
      content.map(async (item) => {
        const festival = await this.festivalsService.findOne(item.festival_id);

        const festivalWorkshops =
          await this.festivalsService.findWorkshopsByFestival(item.festival_id);

        const filteredWs = festivalWorkshops.filter((ws) =>
          item.workshops.includes(ws.id),
        );

        const isFullPass = item.is_fullPass;

        return {
          festival,
          isFullPass,
          workshops: filteredWs,
        };
      }),
    );

    return { ...rest, festivals };
  };

  findAll(): Promise<Order[]> {
    return this.ordersRepository.find();
  }

  findOne(id: string): Promise<Order> {
    return this.ordersRepository.findOne(id);
  }

  findOneByUser(user_id: string): Promise<Order> {
    return this.ordersRepository.findOne({
      where: {
        user_id,
      },
    });
  }

  async create(order: CreateOrderDto) {
    return await this.ordersRepository.save(order);
  }

  async update({ id, ...rest }: Partial<Order>) {
    return await this.ordersRepository.update(id, { ...rest });
  }

  async remove(id: string): Promise<void> {
    await this.ordersRepository.delete(id);
  }

  async register({ content, user_id }): Promise<Order> {
    const isOrder = await this.findOneByUser(user_id);

    if (isOrder) {
      const orderId = isOrder.id;
      const orderContent = isOrder.content.slice();

      if (orderContent.find((c) => c.festival_id === content.festival_id)) {
        const index = orderContent.findIndex(
          (c) => c.festival_id === content.festival_id,
        );
        orderContent.splice(index, 1, content);
      } else {
        orderContent.push(content);
      }

      return await this.ordersRepository.save({
        id: orderId,
        content: orderContent,
      });
    } else {
      return await this.ordersRepository.save({
        content: [content],
        status: 'new',
        user_id: user_id,
      });
    }
  }
}
