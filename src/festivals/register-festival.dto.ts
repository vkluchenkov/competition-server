export class RegisterFestivalDto {
  festivalId: number;
  isFullPass: boolean;
  isSoloPass: boolean;
  workshops?: Array<{ workshop_id: number }>;
  contest?: Array<{ contest_id: number }>;
}
