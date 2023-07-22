// import { University } from "../interfaces/market.interface";
import { AxiosResponse } from "axios";
import {
  CreateItemDto,
  ItemCategory,
  ItemCondition,
} from "../interfaces/item.interface";
import { axiosInstance } from "./base.service";
import { ComputedRef } from "vue";

const getItems = async (search?: { categoryId?: number }) => {
  const axiosRes = await axiosInstance.get("items", {
    params: {
      categoryId: search?.categoryId,
    },
  });

  const data = axiosRes.data;

  return data;
};

const getItemConditions = async (): Promise<ItemCondition[]> => {
  return (await axiosInstance.get("item-conditions")).data;
};

const getItemCategories = async (): Promise<ItemCategory[]> => {
  return (await axiosInstance.get("item-categories")).data;
};

const getItemCategoryByPath = async (categoryPath: string): Promise<ItemCategory> => {
  return (await axiosInstance.get(`item-categories/${categoryPath}`)).data;
};

const uploadItem = async (item: CreateItemDto): Promise<void> => {
  await axiosInstance.post("items", item);
};

export const ItemService = {
  getItems,
  getItemConditions,
  getItemCategories,
  getItemCategoryByPath,
  uploadItem,
};
