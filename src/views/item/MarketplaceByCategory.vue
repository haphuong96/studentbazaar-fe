<script setup lang="ts">
// import { RouteLocationNormalizedLoaded } from "vue-router";
// import { useRoute } from "vue-router";
import { ItemService } from "../../services/item.service";
import { ComputedRef, computed, onMounted, ref, watch } from "vue";
import { ItemCategory } from "../../interfaces/item.interface";
import { routeNames } from "../../router/route-names";
import router from "../../router";
import { SearchOutlined } from "@ant-design/icons-vue";
import { getCategoryPath, Route } from "../../utils/get-category-path.util";
// const route: RouteLocationNormalizedLoaded = useRoute();
// const categoryPath: ComputedRef<string> = computed(() => {
//   return route.params.categoryPath as string;
// });

const emit = defineEmits(["browse-category"]);
const props = defineProps({
  categoryPath: String,
  categoryId: Number,
  searchKeyword: String,
});

const itemList = ref();
const itemCategory = ref<ItemCategory | undefined>();

const searchItems = async () => {
  try {
    const data = await ItemService.getItems({
      categoryId: props.categoryId || itemCategory.value?.id,
      q: props.searchKeyword,
    });
    itemList.value = data;
  } catch (err) {
    console.log(err);
  }
};

const getSelectedItemCategory = async () => {
  if (props.categoryPath || props.categoryId) {
    try {
      const data = await ItemService.getOneItemCategory({
        categoryPath: props.categoryPath,
        id: props.categoryId,
      });
      itemCategory.value = data;
      emit("browse-category", itemCategory.value);
    } catch (err) {
      console.log(err);
      router.push({ name: routeNames.MARKETPLACE_HOME });
    }
  } else {
    try {
      const data = await ItemService.getItemCategories();
      itemCategory.value = {
        id: undefined,
        categoryName: "Marketplace",
        path: "",
        children: data,
      };
    } catch (err) {
      console.log(err);
      router.push({ name: routeNames.MARKETPLACE_HOME });
    }
  }
};

const dataLoad = async () => {
  Promise.all([getSelectedItemCategory()]).then(() => {
    searchItems();
  });
};

watch(props, dataLoad);

onMounted(dataLoad);

const routes: ComputedRef<Route[]> = computed(() => {
  return getCategoryPath(itemCategory.value);
});
</script>
<template>
  <a-breadcrumb v-if="itemCategory?.id">
    <span v-for="route in routes">
      <span v-if="routes.indexOf(route) === routes.length - 1">
        <a-breadcrumb-item>{{ route.breadcrumbName }}</a-breadcrumb-item></span
      >
      <span v-else class="link" @click="router.push(route.path)"
        ><a-breadcrumb-item>{{ route.breadcrumbName }}</a-breadcrumb-item></span
      >
    </span>
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
  <div v-if="props.searchKeyword" class="pb-32">
    <search-outlined></search-outlined>
    Search results for keyword: {{ props.searchKeyword }}
  </div>
  <a-row :gutter="[16, 16]">
    <a-col :span="6" v-for="item in itemList" v-if="itemList">
      <div>{{ item.owner.username }}</div>
      <div
        class="link"
        @click="
          () =>
            router.push({
              name: routeNames.MARKETPLACE_ITEMS_ITEM_DETAILS,
              params: { itemId: item.id },
            })
        "
      >
        <div class="p-16">
          <a-skeleton-image class="img"></a-skeleton-image>
        </div>
        <div>{{ item.itemName }}</div>
      </div>
    </a-col>
  </a-row>
</template>
<style></style>
