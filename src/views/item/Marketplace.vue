<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ItemService } from "../../services/item.service";

const itemList = ref();

onMounted(async () => {
  getItems();
});

const getItems = async () => {
  try {
    const data = await ItemService.getItems();
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
    <a-col :span="6" v-for="item in itemList" v-if="itemList">
      <div>{{ item.owner }}</div>
      <div class="p-16">
        <a-skeleton-image class="img"></a-skeleton-image>
      </div>
      <div>{{ item.itemName }}</div></a-col
    >
  </a-row>
</template>
<style></style>
<!-- class="logo" -->
