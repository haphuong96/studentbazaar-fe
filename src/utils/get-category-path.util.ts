import { ItemCategory } from "../interfaces/item.interface";
import { routeNames } from "../router/route-names";

export interface Route {
  path: { name: string; params?: any };
  breadcrumbName: string;
}

export const getCategoryPath = (
  itemCategory: ItemCategory | undefined
): Route[] => {
  if (!itemCategory) return [];

  let temp: ItemCategory = itemCategory;

  const routeList: Route[] = [
    {
      path: {
        name: routeNames.MARKETPLACE_BY_CATEGORY,
        params: { categoryPath: temp.path },
      },
      breadcrumbName: temp.categoryName,
    },
  ];

  while (temp.parent) {
    temp = temp.parent;
    routeList.unshift({
      path: {
        name: routeNames.MARKETPLACE_BY_CATEGORY,
        params: { categoryPath: temp.path },
      },
      breadcrumbName: temp.categoryName,
    });
  }

  // add marketplace breadcrumb
  routeList.unshift({
    path: {
      name: routeNames.MARKETPLACE_HOME,
    },
    breadcrumbName: "Marketplace",
  });

  console.log(routeList);
  return routeList;
};
