import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FestivalsService } from 'src/festivals/festivals.service';
import { workshopModelToDto } from 'src/festivals/workshopModelToDto';
import { Registration } from 'src/registrations/registration.entity';
import { RegistrationsService } from 'src/registrations/registration.service';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './create-order.dto';
import { OrderDto } from './order.dto';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,

    @InjectRepository(Registration)
    private registrationsRepository: Repository<Registration>,

    private festivalsService: FestivalsService,

    private registrationsService: RegistrationsService,
  ) {}

  orderModelToDto = async ({
    userId,
    content,
    ...rest
  }: Order): Promise<OrderDto> => {
    const festivals = await Promise.all(
      content.map(async (item) => {
        const festival = await this.festivalsService.findOne(item.festivalId);

        const festivalWorkshops =
          await this.festivalsService.findWorkshopsByFestival(item.festivalId);

        const filteredWs = festivalWorkshops.filter((ws) =>
          item.workshops.includes(ws.id),
        );

        const festivalContestCats =
          await this.festivalsService.findContestCatsByFestival(
            item.festivalId,
          );

        const filteredContestCats = festivalContestCats.filter((category) =>
          item.contest.includes(category.id),
        );

        const teachers = await this.festivalsService.findTeachers();
        const teacher = (id) => teachers.find((teacher) => teacher.id === id);

        const wsWithTeachers = filteredWs.map((ws) =>
          workshopModelToDto(ws, teacher),
        );

        const isFullPass = item.isFullPass;

        return {
          festival,
          isFullPass,
          workshops: wsWithTeachers,
          contest: filteredContestCats,
        };
      }),
    );

    return { ...rest, festivals };
  };

  findAll(): Promise<Order[]> {
    return this.ordersRepository.find();
  }

  findOne(id: number): Promise<Order> {
    return this.ordersRepository.findOne(id);
  }

  findOneByUser(userId: number): Promise<Order> {
    return this.ordersRepository.findOne({
      where: {
        userId,
      },
    });
  }

  async create(order: CreateOrderDto) {
    return await this.ordersRepository.save(order);
  }

  // async update({ id, ...rest }: Partial<Order>) {
  //   return await this.ordersRepository.update(id, { ...rest });
  // }

  async remove(id: string): Promise<void> {
    await this.ordersRepository.delete(id);
  }

  async register({ newContent, userId }): Promise<Order> {
    const isOrder = await this.findOneByUser(userId);

    if (isOrder) {
      const orderId = isOrder.id;
      const orderContent = isOrder.content.slice();
      const index = orderContent.findIndex(
        (c) => c.festivalId === newContent.festivalId,
      );

      if (index >= 0) {
        orderContent.splice(index, 1, newContent);
      } else {
        orderContent.push(newContent);
      }

      return await this.ordersRepository.save({
        id: orderId,
        content: orderContent,
      });
    } else {
      return await this.ordersRepository.save({
        content: [newContent],
        status: 'new',
        userId,
      });
    }
  }

  async pay(order: Order): Promise<Order> {
    await order.content.forEach((festival) => {
      const isRegistration = () =>
        this.registrationsService.findOneByFestival({
          userId: order.userId,
          festivalId: festival.festivalId,
        });

      isRegistration().then((res) => {
        if (res) {
          this.registrationsService.remove(res.id);
        }
        this.registrationsService.create({
          isFullPass: festival.isFullPass,
          isSoloPass: festival.isSoloPass,
          workshops: festival.workshops,
          contest: festival.contest,
          status: 'paid',
          festivalId: festival.festivalId,
          userId: order.userId,
        });
      });
    });

    const paidTime = new Date().toISOString();

    this.ordersRepository.save({
      id: order.id,
      status: 'paid',
      paidAt: paidTime,
    });

    return this.findOne(order.id);
  }
}
