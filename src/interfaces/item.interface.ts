export interface ItemCondition {
    id: number,
    conditionName: string,
}

export interface ItemCategory {
    id: number,
    categoryName: string,
    parent: number,
    children: ItemCategory[]
}

export interface CreateItemDto {
    itemName: string | undefined,
    itemDescription: string | undefined,
    categoryId: number | undefined,
    conditionId: number | undefined,
    price: number | undefined
}