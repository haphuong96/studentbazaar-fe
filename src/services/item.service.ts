// import { University } from "../interfaces/market.interface";
// import { AxiosResponse } from "axios";
import {
  CreateItemDto,
  GetItemsCursorBased,
  GetItemsLimitOffset,
  Item,
  ItemCategory,
  ItemCondition,
  ItemImage,
  UpdateItemDto,
} from "../interfaces/item.interface";
import { axiosInstance } from "./base.service";
// import { ComputedRef } from "vue";

const getItems = async (search?: {
  limit?: number;
  offset?: number;
  nextCursor?: number;
  categoryId?: number;
  q?: string;
  campusId?: number;
  universityId?: number;
  ownerId?: number;
}): Promise<GetItemsLimitOffset | GetItemsCursorBased> => {
  const axiosRes = await axiosInstance.get("items", {
    params: {
      limit: search?.limit,
      offset: search?.offset,
      nextCursor: search?.nextCursor,
      categoryId: search?.categoryId,
      q: search?.q,
      campusId: search?.campusId,
      universityId: search?.universityId,
      ownerId: search?.ownerId,
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

const uploadItem = async (item: CreateItemDto): Promise<void> => {
  const formData = new FormData();

  (Object.keys(item) as Array<keyof CreateItemDto>).forEach((key) => {
    if (key === "images") {
      for (const image of item[key]) {
        formData.append("images", image);
      }
    } else {
      if (item[key]) {
        formData.append(key, item[key] as any);
      }
    }
  });

  await axiosInstance.post("items", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const updateItem = async (
  itemId: number | undefined,
  item: UpdateItemDto
): Promise<Item> => {
  return (await axiosInstance.put(`items/${itemId}`, item)).data;
};

const getItemDetails = async (itemId: number | undefined): Promise<Item> => {
  return (await axiosInstance.get(`items/${itemId}`)).data;
};

const uploadItemImages = async (form: FormData): Promise<ItemImage[]> => {
  const axiosRes = await axiosInstance.post("items/images", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return axiosRes.data;
};

const toggleFavorite = async (itemId: number): Promise<Item> => {
  return (await axiosInstance.post(`items/${itemId}/user_favorites/toggle`))
    .data;
};

const deleteItem = async (itemId: number): Promise<Item> => {
  return (await axiosInstance.delete(`items/${itemId}`)).data;
};

export const ItemService = {
  getItems,
  getItemConditions,
  getItemCategories,
  getOneItemCategory,
  uploadItem,
  updateItem,
  getItemDetails,
  uploadItemImages,
  toggleFavorite,
  deleteItem,
};
