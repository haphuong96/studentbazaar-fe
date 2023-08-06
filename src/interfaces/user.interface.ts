import { Campus, University } from "./market.interface";

export interface User {
  id: number;
  university: University;
  campus: Campus;
  fullname: string;
  username: string;
  emailAddress: string;
  status: string;
}

export class UpdateUserDto {
  campusId?: number;
  fullname?: string;
}
