<template>
  <h3 class="mb-16">Favorites</h3>
  <!-- <div v-if="itemList?.length"> -->
  <a-row :gutter="[48, 48]" v-if="itemList?.length">
    <a-col
      :xs="24"
      :sm="24"
      :md="12"
      :lg="8"
      :xl="6"
      v-for="item in itemList"
      v-if="itemList"
    >
      <ItemPost :item="item" />
    </a-col>
  </a-row>
  <!-- </div> -->
  <a-empty v-else></a-empty>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  //  _GetItemsCursorBased,
  Item,
} from "../../interfaces/item.interface";
import { UserService } from "../../services/user.service";
import ItemPost from "../item/components/ItemPost.vue";

const itemList = ref<Item[]>();

const getMyFavoriteItems = async () => {
  try {
    itemList.value = await UserService.getMyFavoriteItems();
  } catch (err) {
    console.log(err);
  }
};

onMounted(() => {
  getMyFavoriteItems();
});
</script>
<style>
/* .ant-btn.ant-btn-dashed.ant-btn-block {
    width: 200px;
    height: 250px;
  } */
</style>
