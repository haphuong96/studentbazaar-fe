// import { University } from "../interfaces/market.interface";
import { AxiosResponse } from "axios";
import { ItemCondition } from "../interfaces/item.interface";
import { axiosInstance } from "./base.service";

const getItems = async () => {
  const axiosRes = await axiosInstance.get(
    "items"
    //   , {
    //     params: {
    //       email: emailAddress,
    //     },
    //   }
  );

  const data = axiosRes.data;

  return data;
};

const getItemConditions = async (): Promise<ItemCondition[]> => {
  const axiosRes: AxiosResponse<ItemCondition[], any> = await axiosInstance.get(
    "item-conditions"
  );
  const data: ItemCondition[] = axiosRes.data;

  return data;
};

export const ItemService = {
  getItems,
  getItemConditions,
};
