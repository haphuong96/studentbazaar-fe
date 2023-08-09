<template>
  <h3>Listed recently</h3>
  <a-row :gutter="[16, 16]">
    <a-col :span="6">
      <div class="py-16">
        <a-button
          type="dashed"
          block
          @click="() => router.push({ name: routeNames.LIST_ITEM })"
        >
          <PlusOutlined />
          Add Item
        </a-button>
      </div></a-col
    >
    <a-col :span="6" v-for="item in itemList.items" v-if="itemList">
      <ItemPost :item="item" :show-owner="false" />
    </a-col>
  </a-row>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { GetItemsCursorBased } from "../../interfaces/item.interface";
import { UserService } from "../../services/user.service";
import ItemPost from "../item/components/ItemPost.vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import router from "../../router";
import { routeNames } from "../../router/route-names";

const itemList = ref<GetItemsCursorBased>();

const getMyItems = async () => {
  try {
    itemList.value = (await UserService.getMyItems()) as GetItemsCursorBased;
  } catch (err) {
    console.log(err);
  }
};

onMounted(() => {
  getMyItems();
});
</script>
<style>
.ant-btn.ant-btn-dashed.ant-btn-block {
  width: 200px;
  height: 250px;
}
</style>
