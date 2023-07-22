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
}
