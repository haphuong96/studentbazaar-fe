<script setup lang="ts">
import { onMounted, ref, Ref, computed } from "vue";
import { ItemService } from "../../services/item.service";
import ItemPost from "./components/ItemPost.vue";
import { DEFAULT_PAGE_SIZE } from "../../common/pagination-constants";
import { GetItemsCursorBased, Item } from "../../interfaces/item.interface";
import { localStorageKeys } from "../../common/storage-keys";
import { MarketService } from "../../services/market.service";
import { Campus } from "../../interfaces/market.interface";

// const onCampus = ref
const itemList = ref<GetItemsCursorBased | undefined>();
const campuses = ref<Campus[] | undefined>();

onMounted(async () => {
  getItems();
  getAllCampuses();
});

const selectCampus: Ref<number | undefined> = computed(() => {
  return +!localStorage.getItem(localStorageKeys.USER_SEARCH_CAMPUS);
});

const getItems = async () => {
  try {
    const data = (await ItemService.getItems({
      limit: DEFAULT_PAGE_SIZE,
      campusId: selectCampus.value,
    })) as GetItemsCursorBased;
    itemList.value = data;
    console.log("itemList", itemList.value);
  } catch (err) {
    console.log(err);
  }
};

const getAllCampuses = async () => {
  try {
    campuses.value = await MarketService.getAllCampuses();
  } catch (err) {
    console.log(err);
  }
};
</script>
<template>
  <h2>Listed recently</h2>
  <div class="d-flex justify-right">
    <a-select ref="select" v-model:value="selectCampus" style="width: 120px">
      <!-- @focus="focus"
      @change="handleChange" -->
      <a-select-option v-for="campus in campuses" :value="campus.id">{{
        campus.campusName
      }}</a-select-option>
    </a-select>
  </div>
  <a-row :gutter="[16, 16]">
    <a-col :span="6" v-for="item in itemList.items" v-if="itemList">
      <ItemPost :item="item" />
    </a-col>
  </a-row>
</template>
<style></style>
<!-- class="logo" -->
