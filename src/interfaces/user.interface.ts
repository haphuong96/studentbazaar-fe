import { Campus, PickUpLocation, University } from "./market.interface";

export interface User {
  id: number;
  university: University;
  campus: Campus;
  fullname: string;
  username: string;
  emailAddress: string;
  status: string;
  defaultPickUpPoint: PickUpLocation;
}

export class UpdateUserDto {
  campusId?: number;
  fullname?: string;
}
