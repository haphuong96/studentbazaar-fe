<script setup lang="ts">
import { RouteLocationNormalizedLoaded } from "vue-router";
import { useRoute } from "vue-router";
import { ItemService } from "../../services/item.service";
import { ComputedRef, computed, onMounted, ref, toRefs, watch } from "vue";
import { ItemCategory } from "../../interfaces/item.interface";
import { routeNames } from "../../router/route-names";
import router from "../../router";

const route: RouteLocationNormalizedLoaded = useRoute();
const categoryPath: ComputedRef<string> = computed(() => {
  return route.params.categoryPath as string;
});

const itemList = ref();
const itemCategory = ref<ItemCategory>({
  categoryName: "",
  // parent: undefined,
  children: [],
  path: categoryPath.value,
});

const getItemsByCategory = async () => {
  try {
    const data = await ItemService.getItems({
      categoryId: itemCategory.value.id,
    });
    itemList.value = data;
  } catch (err) {
    console.log(err);
  }
};

const getSelectedItemCategory = async () => {
  try {
    const data = await ItemService.getItemCategoryByPath(categoryPath.value);
    itemCategory.value = data;
  } catch (err) {
    console.log("itemList", itemList);
    console.log(err);
  }
};

const dataLoad = async () => {
  Promise.all([getSelectedItemCategory()]).then(() => {
    getItemsByCategory();
  });
};

watch(categoryPath, dataLoad);

onMounted(dataLoad);

interface Route {
  path: string;
  breadcrumbName: string;
}

const routes: ComputedRef<Route[]> = computed(() => {
  let temp: ItemCategory = itemCategory.value;

  const routeList: Route[] = [
    {
      path: temp.path,
      breadcrumbName: temp.categoryName,
    },
  ];
  while (temp.parent) {
    temp = temp.parent;
    routeList.unshift({
      path: temp.path,
      breadcrumbName: temp.categoryName,
    });
  }

  console.log(routeList);
  return routeList;
});
</script>
<template>
  <a-breadcrumb :routes="routes">
    <template #itemRender="{ route, paths }">
      <span v-if="routes.indexOf(route) === routes.length - 1">{{
        route.breadcrumbName
      }}</span>
      <router-link v-else :to="route.path">{{
        route.breadcrumbName
      }}</router-link>
    </template>
  </a-breadcrumb>
  <h2>{{ itemCategory?.categoryName }}</h2>
  <a-divider />
  <div v-if="itemCategory && itemCategory?.children.length > 0">
    <a-row>
      <a-col :span="8" v-for="category in itemCategory?.children" class="py-8">
        <a
          @click="
            () => {
              router.push({
                name: routeNames.MARKETPLACE_BY_CATEGORY,
                params: { categoryPath: category.path },
              });
            }
          "
          >{{ category.categoryName }}</a
        ></a-col
      >
    </a-row>
    <a-divider />
  </div>
  <div></div>
  <a-row :gutter="[16, 16]">
    <a-col :span="6" v-for="item in itemList" v-if="itemList">
      <div>{{ item.owner.username }}</div>
      <div class="p-16">
        <a-skeleton-image class="img"></a-skeleton-image>
      </div>
      <div>{{ item.itemName }}</div></a-col
    >
  </a-row>
</template>
<style></style>
