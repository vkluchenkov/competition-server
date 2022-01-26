export class RegisterFestivalDto {
  festival_id: string;
  isFullPass: boolean;
  workshops?: Array<{ workshop_id: number }>;
}
