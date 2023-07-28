import { LoginDto } from "../interfaces/login.interface";
import { University } from "../interfaces/market.interface";
import { SignUpDto } from "../interfaces/signup.interface";
import router from "../router";
import { routeNames } from "../router/route-names";
import { axiosInstance, axiosInstanceLogin } from "./base.service";

const checkEmailAddress = async (
  emailAddress: string | undefined
): Promise<University> => {
  const axiosRes = await axiosInstance.get("auth/signup", {
    params: {
      email: emailAddress,
    },
  });

  const data: University = axiosRes.data;

  return data;
};

const login = async (
  loginDto: LoginDto
): Promise<{ accessToken: string; refreshToken: string }> => {
  const axiosRes = await axiosInstanceLogin.post("auth/login", {
    ...loginDto,
  });

  const data = axiosRes.data;

  return data;
};

const register = async (signUpDto: SignUpDto) => {
  const axiosRes = await axiosInstance.post("auth/signup", {
    ...signUpDto,
  });

  const data = axiosRes.data;

  return data;
};

const verifyEmailToken = async (token: string) => {
  const axiosRes = await axiosInstance.get("auth/email/verify", {
    params: {
      token,
    },
  });

  const data = axiosRes.data;

  return data;
};

const resendVerificationEmail = async (email: string): Promise<void> => {
  await axiosInstance.post("auth/email/resend-verification", {
    email,
  });
};

const logOut = async() => {
  axiosInstance.post("auth/logout");
  localStorage.clear();
  router.push({ name: routeNames.LOGIN });
};

export const AuthService = {
  checkEmailAddress,
  login,
  logOut,
  register,
  verifyEmailToken,
  resendVerificationEmail,
};
