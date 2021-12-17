import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FestivalsService } from './festivals.service';
import { FestivalsController } from './festivals.controller';
import { Festival } from './festival.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Festival])],
  providers: [FestivalsService],
  controllers: [FestivalsController],
})
export class FestivalsModule {}
