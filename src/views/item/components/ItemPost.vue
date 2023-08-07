<template>
  <div v-if="showOwner">{{ item.owner.username }}</div>
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
    <div class="py-16">
      <img
        v-if="item.img.length > 0"
        :src="item.img[0].thumbnailUrl"
        class="thumbnail"
      />

      <a-skeleton-image v-else></a-skeleton-image>
    </div>
    <div>{{ item.itemName }}</div>
  </div>
</template>

<script setup lang="ts">
import { Item } from "../../../interfaces/item.interface";
import router from "../../../router";
import { routeNames } from "../../../router/route-names";

defineProps({
  item: {
    type: Object as () => Item,
    required: true,
  },
  showOwner: {
    type: Boolean,
    default: true,
  },
});
</script>
<style lang="css" scoped>
.thumbnail {
  width: 200px;
  height: 250px;
  object-fit: cover;
}
</style>
