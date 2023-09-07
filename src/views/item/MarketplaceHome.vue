<script setup lang="ts">
import { ref } from "vue";
import { ItemService } from "../../services/item.service";
import ItemPost from "./components/ItemPost.vue";
import { DEFAULT_PAGE_SIZE } from "../../common/pagination-constants";
import { GetItemsCursorBased } from "../../interfaces/item.interface";
import { Campus, University } from "../../interfaces/market.interface";
import LocationModal from "./components/LocationModal.vue";

// const onCampus = ref
const itemList = ref<GetItemsCursorBased | undefined>();

const filter = ref<{
  campusLocation: Campus | undefined;
  university: University | undefined;
}>({
  campusLocation: undefined,
  university: undefined,
});

const getItems = async () => {
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
  }
};

const applyFilterByLocation = async (location: {
  campusLocationSelect: Campus;
  universitySelect: University;
}) => {
  try {
    filter.value.campusLocation = location.campusLocationSelect;
    filter.value.university = location.universitySelect;
    await getItems();
  } catch (err) {
    console.log(err);
  }
};
</script>
<template>
  <h2>Listed recently</h2>
  <div class="d-flex justify-right">
    <LocationModal
      :campusLocationFilter="filter.campusLocation"
      :universityFilter="filter.university"
      @onFilter="applyFilterByLocation"
    ></LocationModal>
  </div>
  <a-row :gutter="[48, 48]" :wrap="true">
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
</template>
<style></style>
<!-- class="logo" -->
