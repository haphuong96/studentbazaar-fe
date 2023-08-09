import { localStorageKeys } from "../common/storage-keys";
import {
  GetItemsCursorBased,
  GetItemsLimitOffset,
} from "../interfaces/item.interface";
import { UpdateUserDto, User } from "../interfaces/user.interface";
import { axiosInstance } from "./base.service";

const getMyProfile = async (): Promise<User> => {
  const axiosRes = await axiosInstance.get("me/profile");

  const data: User = axiosRes.data;

  localStorage.setItem(localStorageKeys.USER_FULLNAME, data.fullname);
  localStorage.setItem(localStorageKeys.USERNAME, data.username);
  localStorage.setItem(localStorageKeys.EMAIL_ADDRESS, data.emailAddress);
  localStorage.setItem(localStorageKeys.USER_STATUS, data.status);
  localStorage.setItem(
    localStorageKeys.USER_UNIVERSITY_ID,
    data.university?.id.toString()
  );
  localStorage.setItem(
    localStorageKeys.USER_CAMPUS_ID,
    data.campus?.id.toString()
  );
  localStorage.setItem(
    localStorageKeys.DEFAULT_PICKUP_LOCATION_ID,
    data.defaultPickUpPoint?.id.toString()
  );

  return data;
};

const activateUser = async (): Promise<boolean> => {
  const axiosRes = await axiosInstance.put("me/account/activate");

  const data: boolean = axiosRes.data;

  return data;
};

const updateMyProfile = async (updateUser: UpdateUserDto): Promise<User> => {
  const axiosRes = await axiosInstance.put("me/profile", updateUser);

  const data: User = axiosRes.data;

  localStorage.setItem(localStorageKeys.USER_FULLNAME, data.fullname);
  localStorage.setItem(localStorageKeys.USERNAME, data.username);
  localStorage.setItem(localStorageKeys.EMAIL_ADDRESS, data.emailAddress);
  localStorage.setItem(localStorageKeys.USER_STATUS, data.status);
  localStorage.setItem(
    localStorageKeys.USER_UNIVERSITY_ID,
    data.university?.id.toString()
  );
  localStorage.setItem(
    localStorageKeys.USER_CAMPUS_ID,
    data.campus?.id.toString()
  );
  localStorage.setItem(
    localStorageKeys.DEFAULT_PICKUP_LOCATION_ID,
    data.defaultPickUpPoint?.id.toString()
  );

  return data;
};

const getUserProfile = async (
  userId: number | undefined
): Promise<User | undefined> => {
  if (userId) {
    return (await axiosInstance.get(`users/${userId}`)).data;
  }
};

const getMyItems = async (query?: {
  limit?: number;
  offset?: number;
  nextCursor?: number;
  categoryId?: number;
  q?: string;
}): Promise<GetItemsCursorBased | GetItemsLimitOffset> => {
  return (await axiosInstance.get("me/items", { params: { ...query } })).data;
};

export const UserService = {
  getMyProfile,
  activateUser,
  updateMyProfile,
  getUserProfile,
  getMyItems
};
