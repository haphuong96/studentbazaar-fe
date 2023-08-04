<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ItemService } from "../../services/item.service";
import ItemPost from "./components/ItemPost.vue";
import { DEFAULT_PAGE_SIZE } from "../../common/pagination-constants";
import { Item } from "../../interfaces/item.interface";

const itemList = ref<{
    total: number;
    items: Item[];
} | {
    nextCursor: string | number;
    items: Item[];
}>();

onMounted(async () => {
  getItems();
});

const getItems = async () => {
  try {
    const data = await ItemService.getItems({ limit: DEFAULT_PAGE_SIZE});
    itemList.value = data;
    console.log("itemList", itemList.value);
  } catch (err) {
    console.log(err);
  }
};
</script>
<template>
  <h2>Listed recently</h2>
  <a-row :gutter="[16, 16]">
    <a-col :span="6" v-for="item in itemList.items" v-if="itemList">
      <ItemPost :item="item" />
    </a-col>
  </a-row>
</template>
<style></style>
<!-- class="logo" -->