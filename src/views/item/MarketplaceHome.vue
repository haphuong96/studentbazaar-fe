<script setup lang="ts">
import { ref, watch } from "vue";
import { ItemService } from "../../services/item.service";
import ItemPost from "./components/ItemPost.vue";
import { DEFAULT_PAGE_SIZE } from "../../common/pagination-constants";
import { GetItemsCursorBased } from "../../interfaces/item.interface";
import { Campus, University } from "../../interfaces/market.interface";
import LocationModal from "./components/LocationModal.vue";

const isOnPageLoading = ref<boolean>(false);

const itemList = ref<GetItemsCursorBased | undefined>();

const filter = ref<{
  campusLocation: Campus | undefined;
  university: University | undefined;
}>({
  campusLocation: undefined,
  university: undefined,
});

const getItems = async () => {
  isOnPageLoading.value = true;
  try {
    const data = (await ItemService.getItems({
      limit: DEFAULT_PAGE_SIZE,
      campusId: filter.value.campusLocation?.id,
      universityId: filter.value.university?.id,
    })) as GetItemsCursorBased;
    itemList.value = data;
    console.log("itemList", itemList.value);
  } catch (err) {
    console.log(err);
  } finally {
    isOnPageLoading.value = false;
  }
};

const applyFilterByLocation = async (location: {
  campusLocationSelect: Campus;
  universitySelect: University;
}) => {
  isOnPageLoading.value = true;
  try {
    filter.value.campusLocation = location.campusLocationSelect;
    filter.value.university = location.universitySelect;
    // await getItems();
  } catch (err) {
    console.log(err);
  } finally {
    isOnPageLoading.value = false;
  }
};

watch(filter.value, async () => {
  await getItems();
});
</script>
<template>
  <a-spin :spinning="isOnPageLoading" :delay="500">
    <h2>Listed recently</h2>
    <div class="d-flex justify-right">
      <LocationModal
        :campusLocationFilter="filter.campusLocation"
        :universityFilter="filter.university"
        @onFilter="applyFilterByLocation"
      ></LocationModal>
    </div>
    <a-row :gutter="[48, 48]" :wrap="true" v-if="!isOnPageLoading">
      <a-col
        :xs="24"
        :sm="12"
        :md="8"
        :lg="8"
        :xl="6"
        :xxl="4"
        v-for="item in itemList.items"
        v-if="itemList"
      >
        <ItemPost :item="item" />
      </a-col>
    </a-row>
  </a-spin>
</template>
<style>
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
<!-- class="logo" -->
