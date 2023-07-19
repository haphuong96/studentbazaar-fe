import { User } from "../interfaces/user.interface";
import { axiosInstance } from "./base.service";

const getMyProfile = async (): Promise<User> => {
  const axiosRes = await axiosInstance.get("me/profile");

  const data: User = axiosRes.data;

  return data;
};

export const UserService = {
    getMyProfile,
}