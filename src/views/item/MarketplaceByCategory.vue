<script setup lang="ts">
import { RouteLocationNormalizedLoaded } from "vue-router";
import { useRoute } from "vue-router";
import { ItemService } from "../../services/item.service";
import { ComputedRef, computed, onMounted, ref, watch } from "vue";
import { ItemCategory } from "../../interfaces/item.interface";

const route: RouteLocationNormalizedLoaded = useRoute();
const categoryHierarchy: number[] = route.params.categoryId;
// const categoryId: number = categoryHierarchy[categoryHierarchy.length - 1];
const categoryId : ComputedRef<number> = computed(() => {
  return +route.params.categoryId;
});

const itemList = ref();
const itemCategory = ref<ItemCategory>();

const getItemsByCategory = async () => {
  try {
    const data = await ItemService.getItems({ categoryId: categoryId.value });
    itemList.value = data;
    console.log("itemList", itemList.value);
  } catch (err) {
    console.log(err);
  }
};

const getSelectedItemCategory = async () => {
  try {
    const data = await ItemService.getItemCategoryById(categoryId.value);
    itemCategory.value = data;
  } catch (err) {
    console.log(err);
  }
};

watch(
  categoryId,
  async () => {
    console.log(categoryId.value);
    getSelectedItemCategory();
    getItemsByCategory();
  }
);

onMounted(async () => {
  getSelectedItemCategory();
  getItemsByCategory();
});
</script>
<template>
  <h2>{{ itemCategory?.categoryName }}</h2>
  <a-divider></a-divider>
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
