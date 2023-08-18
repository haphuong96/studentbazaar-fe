<script setup lang="ts">
import { onMounted, ref, Ref, computed } from "vue";
import { ItemService } from "../../services/item.service";
import ItemPost from "./components/ItemPost.vue";
import { DEFAULT_PAGE_SIZE } from "../../common/pagination-constants";
import { GetItemsCursorBased } from "../../interfaces/item.interface";
import { localStorageKeys } from "../../common/storage-keys";
import { MarketService } from "../../services/market.service";
import { Campus, University } from "../../interfaces/market.interface";
import { EnvironmentFilled } from "@ant-design/icons-vue";

// const onCampus = ref
const itemList = ref<GetItemsCursorBased | undefined>();

onMounted(async () => {
  // load campus location and university from local storage
  await loadLocation();
  // get items
  getItems();
  //load data to modal
  getAllCampuses();
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
  campusLocationOptions: Campus[] | undefined;
  universityOptions: University[] | undefined;
}>({
  visible: false,
  campusLocationSelect: undefined,
  universitySelect: undefined,
  campusLocationOptions: undefined,
  universityOptions: undefined,
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
    locationModal.value.campusLocationOptions =
      await MarketService.getAllCampuses();
  } catch (err) {
    console.log(err);
  }
};

const loadLocation = async () => {
  const userSearchCampusId: Ref<number | undefined> = computed(() => {
    const searchCampusId = localStorage.getItem(
      localStorageKeys.USER_SEARCH_CAMPUS_LOCATION
    );
    return searchCampusId ? +searchCampusId : undefined;
  });

  const userSearchUniversityId: Ref<number | undefined> = computed(() => {
    const searchCampusId = localStorage.getItem(
      localStorageKeys.USER_SEARCH_UNIVERSITY
    );
    return searchCampusId ? +searchCampusId : undefined;
  });

  try {
    filter.value.campusLocation = await MarketService.getOneCampusById(
      userSearchCampusId.value
    );

    filter.value.university = filter.value.campusLocation?.universities?.find(
      (university) => university.id === userSearchUniversityId.value
    );
  } catch (err) {
    console.log(err);
  }
};

const showLocationModal = () => {
  locationModal.value.campusLocationSelect = filter.value.campusLocation;
  // since reset modal campusLocationSelect, reset universityOptions at the same time
  locationModal.value.universityOptions =
    filter.value.campusLocation?.universities;

  locationModal.value.universitySelect = filter.value.university;
  locationModal.value.visible = true;
};

const selectCampusLocation = (campusLocationId: number | undefined) => {
  locationModal.value.campusLocationSelect =
    locationModal.value.campusLocationOptions?.find(
      (campus) => campus.id === campusLocationId
    );
  locationModal.value.universityOptions =
    filter.value.campusLocation?.universities;
};

const selectUniversity = (universityId: number) => {
  locationModal.value.universitySelect =
    locationModal.value.universityOptions?.find(
      (university) => university.id === universityId
    );
};

const applyFilterByLocation = async () => {
  try {
    filter.value.campusLocation = locationModal.value.campusLocationSelect;
    filter.value.university = locationModal.value.universitySelect;
    await getItems();
    locationModal.value.visible = false;

    // set user's new search campus location and university to local storage
    localStorage.setItem(
      localStorageKeys.USER_SEARCH_CAMPUS_LOCATION,
      filter.value.campusLocation?.id?.toString() || ""
    );
    localStorage.setItem(
      localStorageKeys.USER_SEARCH_UNIVERSITY,
      filter.value.university?.id?.toString() || ""
    );
  } catch (err) {
    console.log(err);
  }
};
</script>
<template>
  <h2>Listed recently</h2>
  <div class="d-flex justify-right">
    <a-button
      type="link"
      @click="showLocationModal"
      v-if="filter.campusLocation"
    >
      <environment-filled /><span>{{ filter.campusLocation?.campusName }} </span
      ><span v-if="filter.university">
        &nbsp;· {{ filter.university?.universityName }}</span
      ></a-button
    >
    <a-modal
      v-model:visible="locationModal.visible"
      title="Pick Up Location"
      :maskClosable="false"
    >
      <template #footer>
        <a-button @click="applyFilterByLocation">Apply</a-button>
      </template>
      <div>
        <!-- d-flex justify-between mb-16 -->
        <div class="mb-8">Campus Location</div>
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
          :options="locationModal.campusLocationOptions"
          @change="selectCampusLocation"
        >
          <a-select-option
            v-for="campus in locationModal.campusLocationOptions"
            :key="campus.id"
            :value="campus.id"
          >
            {{ campus.campusName }}
          </a-select-option></a-select
        >
        <div class="mb-8 mt-16">University</div>
        <a-select
          :value="locationModal.universitySelect?.id"
          show-search
          placeholder="[All Universities]"
          style="width: 200px"
          :fieldNames="{
            label: 'universityName',
            value: 'id',
          }"
          :options="locationModal.universityOptions"
          :allow-clear="true"
          @change="selectUniversity"
        ></a-select>
      </div>
    </a-modal>
  </div>
  <a-row :gutter="[16, 16]" :wrap="true">
    <a-col :span="6" v-for="item in itemList.items" v-if="itemList">
      <ItemPost :item="item" />
    </a-col>
  </a-row>
</template>
<style></style>
<!-- class="logo" -->
