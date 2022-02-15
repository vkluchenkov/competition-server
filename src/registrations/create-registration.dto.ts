export class CreateRegistrationDto {
  isFullPass: boolean;
  isSoloPass: boolean;
  workshops: number[];
  contest: number[];
  status: string;
  festivalId: number;
  userId: number;
}
