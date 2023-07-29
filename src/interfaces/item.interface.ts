import { Image } from "./image.interface";

export interface ItemCondition {
  id: number;
  conditionName: string;
}

export interface ItemCategory {
  id?: number;
  categoryName: string;
  parent?: ItemCategory | number | any;
  children?: ItemCategory[] | any;
  path: string;
}

export interface CreateItemDto {
  itemName: string | undefined;
  itemDescription: string | undefined;
  categoryId: number | undefined;
  conditionId: number | undefined;
  price: number | undefined;
  img?: Image[];
}

export interface Item {
  id: number;
  owner: any;
  category: ItemCategory;
  condition: ItemCondition;
  status: string;
  itemName: string;
  itemDescription: string;
  itemPrice: number;
  createdDatetime: string;
  lastUpdatedDatetime: string;
  img: Image[]
}

export interface ItemImage {
  id: number;
  image: Image;
}