export interface SignUpDto {
  emailAddress: string;
  fullname: string;
  username: string;
  password: string;
}

export interface SignUpDtoErr {
    emailAddress: any;
    fullname: any;
    username: any;
    password: any;
  }