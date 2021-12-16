import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FestivalsController } from './festivals.controller';

@Module({
  controllers: [FestivalsController],
})
export class AppModule {}
