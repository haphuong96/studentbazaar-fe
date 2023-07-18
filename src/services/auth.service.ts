import { University } from "../interfaces/market.interface";
import { SignUpDto } from "../interfaces/signup.interface";
import { axiosInstance } from "./base.service";

const checkEmailAddress = async (emailAddress: string | undefined) : Promise<University> => {
  const axiosRes = await axiosInstance.get("auth/signup", {
    params: {
      email: emailAddress,
    },
  });

  const data : University = axiosRes.data;

  return data;
};

const login = async (usernameOrEmail: string, password: string) => {
  const axiosRes = await axiosInstance.post("auth/login", {
    usernameOrEmail,
    password,
  });

  const data = axiosRes.data;

  return data;
}

const register = async (signUpDto: SignUpDto) => {
  const axiosRes = await axiosInstance.post("auth/signup", {
    ...signUpDto
  });

  const data = axiosRes.data;

  return data;
}
export const AuthService = {
  checkEmailAddress,
  login,
  register
};
