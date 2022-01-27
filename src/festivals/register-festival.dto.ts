export class RegisterFestivalDto {
  festivalId: number;
  isFullPass: boolean;
  workshops?: Array<{ workshop_id: number }>;
}
