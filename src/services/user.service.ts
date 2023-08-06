import { localStorageKeys } from "../common/storage-keys";
import { UpdateUserDto, User } from "../interfaces/user.interface";
import { axiosInstance } from "./base.service";

const getMyProfile = async (): Promise<User> => {
  const axiosRes = await axiosInstance.get("me/profile");

  const data: User = axiosRes.data;

  localStorage.setItem(localStorageKeys.USER_FULLNAME, data.fullname);
  localStorage.setItem(localStorageKeys.USERNAME, data.username);
  localStorage.setItem(localStorageKeys.USER_STATUS, data.status);
  return data;
};

const activateUser = async(): Promise<boolean> => {
  const axiosRes = await axiosInstance.put("me/account/activate");

  const data: boolean = axiosRes.data;

  return data;
}

const updateMyProfile = async(updateUser: UpdateUserDto) : Promise<User> => {
  const axiosRes = await axiosInstance.put("me/profile", updateUser);

  const data: User = axiosRes.data;

  localStorage.setItem(localStorageKeys.USER_FULLNAME, data.fullname);
  localStorage.setItem(localStorageKeys.USERNAME, data.username);
  localStorage.setItem(localStorageKeys.USER_STATUS, data.status);

  return data;
} 

export const UserService = {
    getMyProfile,
    activateUser,
    updateMyProfile
}