import {
  ArrayContains,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class OrderFestivalDto {
  @IsNotEmpty()
  @IsNumber()
  festivalId: number;

  @IsNotEmpty()
  @IsBoolean()
  isFullPass: boolean;

  @IsOptional()
  @IsBoolean()
  isSoloPass?: boolean;

  @IsNotEmpty()
  @IsNumber({}, { each: true })
  workshops: number[];

  @IsNotEmpty()
  @IsNumber({}, { each: true })
  contest: number[];
}
