import { Image } from "./image.interface";
import { PickUpLocation } from "./market.interface";
import { User } from "./user.interface";

export enum ItemStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD',
  HIDDEN = 'HIDDEN',
}

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
  itemName?: string;
  itemDescription?: string;
  categoryId?: number;
  conditionId?: number;
  price?: number;
  images: any[];
  locationId?: number | undefined;
  status?: ItemStatus;
}

export interface UpdateItemDto {
  status?: ItemStatus;
}

export interface Item {
  id: number;
  owner: User;
  category: number | undefined;
  condition: ItemCondition;
  status: ItemStatus;
  itemName: string;
  itemDescription?: string;
  itemPrice: number;
  createdDatetime: string;
  lastUpdatedDatetime: string;
  location: PickUpLocation;
  img: GetItemImage[];
  isFavorite?: boolean;
  favoriteCount?: number;
}

export interface GetItems {
  items: Item[];
}

export interface GetItemsLimitOffset extends GetItems {
  total: number;
}

export interface GetItemsCursorBased extends GetItems {
  nextCursor: number;
}

export interface GetItemImage {
  url: string;
  thumbnailUrl: string;
}

export interface ItemImage {
  image: Image;
  thumbnail: Image;
}
