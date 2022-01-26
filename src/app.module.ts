import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { Festival } from './festivals/festival.entity';
import { FestivalsModule } from './festivals/festivals.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { Workshop } from './festivals/workshop.entity';
import { Teacher } from './festivals/teacher.entity';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/order.entity';
import { Registration } from './registrations/registration.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ec2-3-89-214-80.compute-1.amazonaws.com',
      port: 5432,
      username: 'axpockxyajdomm',
      password:
        'c66e5e9223890b64f9a2320499b9d3ece5273ad370c4f0110c461f214e9aa0db',
      database: 'dalq761g9g15v1',
      entities: [Festival, User, Workshop, Teacher, Order, Registration],
      synchronize: false,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
    FestivalsModule,
    UsersModule,
    AuthModule,
    OrdersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
