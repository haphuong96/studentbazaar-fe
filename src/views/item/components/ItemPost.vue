<template>
  <div>
    <div v-if="showOwner">
      <UserInfo
        :user="item.owner"
        :show-university="false"
        :show-campus="false"
        :show-avatar="true"
        :space="8"
        avatar-size='small'
      />
    </div>
    <div
      class="link item-post-container"
      @click="
        () =>
          router.push({
            name: routeNames.MARKETPLACE_ITEMS_ITEM_DETAILS,
            params: { itemId: item.id },
          })
      "
    >
      <div
        :class="`${
          item.img.length
            ? 'thumbnail-container'
            : 'thumbnail-container-skeleton'
        } `"
      >
        <img
          v-if="item.img.length"
          :src="item.img[0].thumbnailUrl"
          class="thumbnail-container_img"
        />

        <a-skeleton-image v-else></a-skeleton-image>
      </div>
      <div class="d-flex">
        <div class="flex-grow-1">
          <span v-if="item.itemPrice">£{{ item.itemPrice }}</span>
          <span v-else>Free</span>
        </div>
        <div>
          <!-- <heart-outlined /> -->
          <heart-two-tone two-tone-color="#eb2f96" />
          {{ item.favoriteCount }}
        </div>
      </div>
      <div></div>
      <div>{{ item.itemName }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Item } from "../../../interfaces/item.interface";
import router from "../../../router";
import { routeNames } from "../../../router/route-names";
import UserInfo from "./UserInfo.vue";
import { HeartOutlined, HeartTwoTone } from "@ant-design/icons-vue";

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
.thumbnail-container_img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.thumbnail-container {
  /* width: 200px; */
  margin: 8px 0px;
}

.item-post-container {
  /* max-width: 200px; */
  width: 100%;
}

.thumbnail-container-skeleton {
  height: 250px;
  margin: 8px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #d7d7d740;
}
</style>
