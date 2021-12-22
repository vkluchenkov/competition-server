import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FestivalsService } from './festivals.service';
import { FestivalsController } from './festivals.controller';
import { Festival } from './festival.entity';
import { Workshop } from './workshop.entity';
import { Teacher } from './teacher.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Festival]),
    TypeOrmModule.forFeature([Workshop]),
    TypeOrmModule.forFeature([Teacher]),
  ],
  providers: [FestivalsService],
  controllers: [FestivalsController],
})
export class FestivalsModule {}
