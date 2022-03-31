import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FestivalsService } from 'src/festivals/festivals.service';
import { OrderUnregisterFestivalDto } from 'src/festivals/order-unregister-festival.dto';
import { workshopModelToDto } from 'src/festivals/workshopModelToDto';
import { Registration } from 'src/registrations/registration.entity';
import { RegistrationsService } from 'src/registrations/registration.service';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './create-order.dto';
import { getContestDiff } from './helpers/utils/getContestDiff';
import { getWorshopsDiff } from './helpers/utils/getWorkshopsDiff';
import { OrderRegisterDto } from './order-register-dto';
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

        const filteredWs = festivalWorkshops.filter((ws) => {
          if (item.workshops) {
            return item.workshops.includes(ws.id);
          }
        });

        const festivalContestCats =
          await this.festivalsService.findContestCatsByFestival(
            item.festivalId,
          );

        const filteredContestCats = festivalContestCats.filter((category) => {
          if (item.contest) {
            return item.contest.includes(category.id);
          }
        });

        const teachers = await this.festivalsService.findTeachers();
        const teacher = (id) => teachers.find((teacher) => teacher.id === id);

        const wsWithTeachers = filteredWs.map((ws) =>
          workshopModelToDto(ws, teacher),
        );

        return {
          festival,
          isFullPass: item.isFullPass,
          isSoloPass: item.isSoloPass,
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
        status: 'new',
      },
    });
  }

  async create(order: CreateOrderDto) {
    return await this.ordersRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    await this.ordersRepository.delete(id);
  }

  async removeFestival({ orderId, orderContent, index, festivalId }) {
    if (orderContent.length === 1) {
      await this.ordersRepository.save({
        id: orderId,
        status: 'cancelled',
      });
    } else {
      orderContent.splice(index, 1);
      await this.ordersRepository.save({
        id: orderId,
        content: orderContent,
      });
    }
  }

  // -----------------------------------------
  async register({
    contentPayload,
    userId,
  }: OrderRegisterDto): Promise<Order> | null {
    const order = await this.findOneByUser(userId);

    const registration = await this.registrationsService.findOneByFestival({
      userId,
      festivalId: contentPayload.festivalId,
    });

    const workshops = getWorshopsDiff({
      order: order ? order : null,
      contentPayload,
      registration: registration ? registration : null,
    });

    const contest = getContestDiff({
      order: order ? order : null,
      contentPayload,
      registration: registration ? registration : null,
    });

    // if active order
    if (order && order.status === 'new') {
      const orderId = order.id;
      const orderContent = order.content.slice();
      const index = orderContent.findIndex(
        (c) => c.festivalId === contentPayload.festivalId,
      );

      // Build payload
      const newContent = () => {
        const isFullPass = () => {
          if (orderContent[index].isFullPass === undefined) {
            return false;
          } else {
            return contentPayload.isFullPass === undefined
              ? orderContent[index].isFullPass
              : contentPayload.isFullPass;
          }
        };

        return {
          workshops,
          contest,
          isFullPass: isFullPass(),
          isSoloPass: contentPayload.isSoloPass ? true : false,
          festivalId: contentPayload.festivalId,
        };
      };

      // Payload actions
      // if payload empty and festival is in active order, unregister festival
      if (
        !newContent().contest.length &&
        !newContent().workshops.length &&
        !newContent().isFullPass &&
        !newContent().isSoloPass &&
        index >= 0
      ) {
        await this.removeFestival({
          orderId: order.id,
          festivalId: contentPayload.festivalId,
          index,
          orderContent,
        });
        return null;
      } else {
        // if festival is in active order replace, otherwise push
        index >= 0
          ? orderContent.splice(index, 1, newContent())
          : orderContent.push(newContent());

        await this.ordersRepository.save({
          id: orderId,
          content: orderContent,
        });
      }
    }

    // if no active order
    else {
      // Build Payload
      const newContent = {
        workshops,
        contest,
        isFullPass:
          contentPayload.isFullPass === undefined
            ? false
            : contentPayload.isFullPass,
        isSoloPass: contentPayload.isSoloPass ? true : false,
        festivalId: contentPayload.festivalId,
      };
      if (
        !newContent.contest.length &&
        !newContent.workshops.length &&
        !newContent.isFullPass &&
        !newContent.isSoloPass
      )
        return null;

      // Payload actions
      await this.ordersRepository.save({
        content: [newContent],
        status: 'new',
        userId,
      });
    }
  }

  // ----------------------------------------------

  async pay(order: Order): Promise<Order> {
    await order.content.forEach(async (festival) => {
      const getRegistration = async () =>
        await this.registrationsService.findOneByFestival({
          userId: order.userId,
          festivalId: festival.festivalId,
        });

      const registration = await getRegistration();

      const regWorkshops = () => {
        if (
          registration &&
          registration.workshops.length &&
          festival.workshops.length
        ) {
          const filtered = festival.workshops.filter(
            (festivalWorkshop) =>
              !registration.workshops.includes(festivalWorkshop),
          );
          return [...registration.workshops, ...filtered];
        }
        if (
          (!registration || !registration.workshops.length) &&
          festival.workshops.length
        )
          return festival.workshops;
        if (
          registration &&
          registration.workshops.length &&
          !festival.workshops.length
        )
          return registration.workshops;
        else return [];
      };

      const regContest = () => {
        if (
          registration &&
          registration.contest.length &&
          festival.contest.length
        ) {
          const filtered = festival.contest.filter(
            (festivalContestCat) =>
              !registration.contest.includes(festivalContestCat),
          );
          return [...registration.contest, ...filtered];
        }
        if (
          (!registration || !registration.contest.length) &&
          festival.contest.length
        )
          return festival.contest;
        if (
          registration &&
          registration.contest.length &&
          !festival.contest.length
        )
          return registration.contest;
        else return [];
      };

      if (registration) {
        this.registrationsService.remove(registration.id);
      }

      this.registrationsService.create({
        isFullPass: festival.isFullPass,
        isSoloPass: festival.isSoloPass,
        workshops: regWorkshops(),
        contest: regContest(),
        status: 'paid',
        festivalId: festival.festivalId,
        userId: order.userId,
      });
    });

    const paidAt = new Date().toISOString();

    await this.ordersRepository.save({
      id: order.id,
      status: 'paid',
      paidAt: paidAt,
    });

    return this.findOne(order.id);
  }
}
