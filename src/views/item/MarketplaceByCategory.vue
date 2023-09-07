<script setup lang="ts">
import { ItemService } from "../../services/item.service";
import { ComputedRef, Ref, computed, onMounted, ref, watch } from "vue";
import {
  GetItemsLimitOffset,
  ItemCategory,
} from "../../interfaces/item.interface";
import { routeNames } from "../../router/route-names";
import router from "../../router";
import { SearchOutlined } from "@ant-design/icons-vue";
import { getCategoryPath, Route } from "../../utils/get-category-path.util";
import ItemPost from "./components/ItemPost.vue";
import { paginationHelper } from "../../utils/pagination.util";
import { DEFAULT_PAGE_SIZE } from "../../common/pagination-constants";
import LocationModal from "./components/LocationModal.vue";
import { Campus, University } from "../../interfaces/market.interface";

const emit = defineEmits(["browse-category"]);
const props = defineProps({
  categoryPath: String,
  categoryId: Number,
  searchKeyword: String,
});

const locationFilter = ref<{
  campusLocation: Campus | undefined;
  university: University | undefined;
}>({
  campusLocation: undefined,
  university: undefined,
});

const itemList: Ref<GetItemsLimitOffset | undefined> = ref();
const itemCategory = ref<ItemCategory | undefined>();

const searchItems = async (query?: { page?: number; pageSize?: number }) => {
  const { limit, offset } = paginationHelper(query?.page, query?.pageSize);

  try {
    const data = (await ItemService.getItems({
      categoryId: props.categoryId || itemCategory.value?.id,
      q: props.searchKeyword,
      campusId: locationFilter.value.campusLocation?.id,
      universityId: locationFilter.value.university?.id,
      limit,
      offset,
    })) as GetItemsLimitOffset;

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

const onPageChange = (page: number, pageSize: number) => {
  searchItems({ page, pageSize });
};

const applyFilterByLocation = async (location: {
  campusLocationSelect: Campus;
  universitySelect: University;
}) => {
  try {
    locationFilter.value.campusLocation = location.campusLocationSelect;
    locationFilter.value.university = location.universitySelect;
    await searchItems();
  } catch (err) {
    console.log(err);
  }
};
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
  <div class="d-flex justify-right">
    <LocationModal
      :campusLocationFilter="locationFilter.campusLocation"
      :universityFilter="locationFilter.university"
      @onFilter="applyFilterByLocation"
    ></LocationModal>
  </div>
  <div v-if="props.searchKeyword" class="pb-32">
    <search-outlined></search-outlined>
    Search results for keyword: {{ props.searchKeyword }}
  </div>
  <div v-if="itemList && itemList.items.length">
    <a-row :gutter="[48, 48]">
      <a-col
        :xs="24"
        :sm="12"
        :md="8"
        :lg="8"
        :xl="6"
        :xxl="4"
        v-for="item in itemList.items"
      >
        <ItemPost :item="item"></ItemPost>
      </a-col>
    </a-row>
    <div class="my-32">
      <a-pagination
        v-model:pageSize="DEFAULT_PAGE_SIZE"
        :total="itemList?.total"
        @change="onPageChange"
      />
    </div>
  </div>
  <div v-else>
    <a-empty></a-empty>
  </div>
</template>
<style></style>
