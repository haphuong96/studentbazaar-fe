import { localStorageKeys } from "../common/storage-keys";
import { LoginDto } from "../interfaces/login.interface";
import { University } from "../interfaces/market.interface";
import { SignUpDto } from "../interfaces/signup.interface";
import router from "../router";
import { routeNames } from "../router/route-names";
import { socket } from "../socket";
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

  const data : {accessToken: string, refreshToken: string} = axiosRes.data;

  // if successful, store tokens in local storage
  localStorage.setItem(localStorageKeys.ACCESS_TOKEN, data.accessToken);
  localStorage.setItem(localStorageKeys.REFRESH_TOKEN, data.refreshToken);

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

const logOut = async () => {
  await axiosInstance.post("auth/logout");
  localStorage.clear();

  // disconnect socket
  socket.disconnect();
  
  router.push({ name: routeNames.LOGIN });
};

const refreshToken = async () : Promise<boolean> => {
  const refreshToken = localStorage.getItem(
    localStorageKeys.REFRESH_TOKEN
  );

  const res = await axiosInstance.post("auth/refresh-token", {
    refreshToken,
  });

  if (res.status === 201) {
    // refresh token success
    localStorage.setItem(
      localStorageKeys.ACCESS_TOKEN,
      res.data.accessToken
    );
    localStorage.setItem(
      localStorageKeys.REFRESH_TOKEN,
      res.data.refreshToken
    );
    return true;
  }

  return false;
}

export const AuthService = {
  checkEmailAddress,
  login,
  logOut,
  register,
  verifyEmailToken,
  resendVerificationEmail,
  refreshToken
};
