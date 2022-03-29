import { IsNotEmpty, IsNumber } from 'class-validator';

export class OrderUnregisterFestivalDto {
  @IsNotEmpty()
  @IsNumber()
  festivalId: number;
}
