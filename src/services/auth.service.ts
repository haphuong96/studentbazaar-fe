import { University } from "../interfaces/market.interface";
import { axiosInstance } from "./base.service";

const checkEmailAddress = async (emailAddress: string | undefined) : Promise<University> => {
  const axiosRes = await axiosInstance.get("signup", {
    params: {
      email: emailAddress,
    },
  });

  const data : University = axiosRes.data;

  return data;
};

export const AuthService = {
  checkEmailAddress,
};
