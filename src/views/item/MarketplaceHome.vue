<script setup lang="ts">
import { onMounted, ref, Ref, computed } from "vue";
import { ItemService } from "../../services/item.service";
import ItemPost from "./components/ItemPost.vue";
import { DEFAULT_PAGE_SIZE } from "../../common/pagination-constants";
import { GetItemsCursorBased, Item } from "../../interfaces/item.interface";
import { localStorageKeys } from "../../common/storage-keys";
import { MarketService } from "../../services/market.service";
import { Campus, University } from "../../interfaces/market.interface";

// const onCampus = ref
const itemList = ref<GetItemsCursorBased | undefined>();
const campusLocationOptions = ref<Campus[] | undefined>();
const universityOptions = ref<University[] | undefined>();

onMounted(async () => {
  filter.value.campusLocation
  filter.value.university
  getItems();
  getAllCampuses();
});

const selectCampusId: Ref<number | undefined> = computed(() => {
  const searchCampusId = localStorage.getItem(
    localStorageKeys.USER_SEARCH_CAMPUS
  );
  return searchCampusId ? +searchCampusId : undefined;
});

const filter = ref<{
  campusLocation: Campus | undefined;
  university: University | undefined;
}>({
  campusLocation: undefined,
  university: undefined,
});

const locationModal = ref<{
  visible: boolean;
  campusLocationSelect: Campus | undefined;
  universitySelect: University | undefined;
}>({
  visible: false,
  campusLocationSelect: undefined,
  universitySelect: undefined,
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

const getAllCampuses = async () => {
  try {
    campusLocationOptions.value = await MarketService.getAllCampuses();
  } catch (err) {
    console.log(err);
  }
};

const loadLocation = async () => {
  try {
    filter.value.campusLocation = await MarketService.getOneCampusById(
      selectCampusId.value
    );
    
  } catch (err) {
    console.log(err);
  }
};

const showLocationModal = () => {
  locationModal.value.campusLocationSelect = filter.value.campusLocation;
  locationModal.value.universitySelect = filter.value.university;
  locationModal.value.visible = true;
};

const selectCampusLocation = (campusLocationId: number) => {
  locationModal.value.campusLocationSelect = campusLocationOptions.value?.find(
    (campus) => campus.id === campusLocationId
  );
  universityOptions.value = filter.value.campusLocation?.universities;
};

const selectUniversity = (universityId: number) => {
  locationModal.value.universitySelect = universityOptions.value?.find(
    (university) => university.id === universityId
  );
};

const filterByLocation = async() => {
  try {
    filter.value.campusLocation = locationModal.value.campusLocationSelect;
    filter.value.university = locationModal.value.universitySelect;
    await getItems();
    locationModal.value.visible = false;
  } catch (err) {
    console.log(err);
  }
};

</script>
<template>
  <h2>Listed recently</h2>
  <div class="d-flex justify-right">
    <!-- <a-select ref="select" v-model:value="selectCampus" style="width: 120px">
      <a-select-option v-for="campus in campuses" :value="campus.id">{{
        campus.campusName
      }}</a-select-option>
    </a-select> -->
    <a-button type="link" @click="showLocationModal">
      <environment-filled />{{ filter.campusLocation?.campusName }}</a-button
    >
    <a-modal
      v-model:visible="locationModal.visible"
      title="Pick Up Location"
      :maskClosable="false"
    >
      <template #footer>
        <a-button @click="filterByLocation">Apply</a-button>
      </template>
      <div>
        <!-- d-flex justify-between mb-16 -->
        <div>Campus Location</div>
        <a-select
          :value="locationModal.campusLocationSelect?.id"
          show-search
          placeholder="Select a campus location"
          style="width: 200px"
          :filter-option="true"
          :fieldNames="{
            label: 'campusName',
            value: 'id',
          }"
          :options="campusLocationOptions"
          @change="selectCampusLocation"
        ></a-select>
        <div>University</div>
        <a-select
          :value="locationModal.universitySelect?.id"
          show-search
          placeholder="Select a university"
          style="width: 200px"
          :fieldNames="{
            label: 'universityName',
            value: 'id',
          }"
          :options="universityOptions"
          @change="selectUniversity"
        ></a-select>
      </div>
    </a-modal>
  </div>
  <a-row :gutter="[16, 16]">
    <a-col :span="6" v-for="item in itemList.items" v-if="itemList">
      <ItemPost :item="item" />
    </a-col>
  </a-row>
</template>
<style></style>
<!-- class="logo" -->
