// import { University } from "../interfaces/market.interface";
import { AxiosResponse } from "axios";
import {
  CreateItemDto,
  Item,
  ItemCategory,
  ItemCondition,
} from "../interfaces/item.interface";
import { axiosInstance } from "./base.service";
import { ComputedRef } from "vue";

const getItems = async (search?: { categoryId?: number; q?: string }) => {
  const axiosRes = await axiosInstance.get("items", {
    params: {
      categoryId: search?.categoryId,
      q: search?.q,
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

const getOneItemCategory = async (search: {
  categoryPath?: string;
  id?: number;
}): Promise<ItemCategory | undefined> => {
  if (search.categoryPath && search.id) {
    throw new Error("Cannot search by both categoryPath and id");
  }

  if (search.categoryPath) {
    return (
      await axiosInstance.get(`item-categories/path/${search.categoryPath}`)
    ).data;
  }

  if (search.id) {
    return (await axiosInstance.get(`item-categories/${search.id}`)).data;
  }
};

const uploadItemImages = async (form: FormData): Promise<string[]> => {
  console.log('form', form);
  const axiosRes = await axiosInstance.post("items/images", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return axiosRes.data;
}

const uploadItem = async (item: CreateItemDto): Promise<void> => {
  await axiosInstance.post("items", item);
};

const getItemDetails = async (itemId: number | undefined) : Promise<Item> => {
  return (await axiosInstance.get(`items/${itemId}`)).data;
};
export const ItemService = {
  getItems,
  getItemConditions,
  getItemCategories,
  getOneItemCategory,
  uploadItem,
  getItemDetails,
  uploadItemImages
};
