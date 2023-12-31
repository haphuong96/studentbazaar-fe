import { Campus, PickUpLocation, University } from "./market.interface";

export interface User {
  id: number;
  university: University;
  campus: Campus;
  fullname: string;
  aboutMe?: string;
  username: string;
  emailAddress: string;
  status: string;
  defaultPickUpPoint: PickUpLocation;
  suggestedPickUpPoints?: PickUpLocation[];
}

export class UpdateUserDto {
  campusId?: number;
  fullname?: string;
  aboutMe?: string;
  defaultPickUpPointId?: number;
}
