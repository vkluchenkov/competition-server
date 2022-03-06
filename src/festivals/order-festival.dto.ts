export class OrderFestivalDto {
  festivalId: number;
  isFullPass: boolean;
  isSoloPass: boolean;
  workshops?: { workshopId: number }[];
  contest?: { contestId: number }[];
}
