<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ItemService } from "../../services/item.service";
import router from "../../router";
import { routeNames } from "../../router/route-names";

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
      </div></a-col
    >
  </a-row>
</template>
<style></style>
<!-- class="logo" -->
