<script setup lang="ts">
import { onMounted, ref, Ref, computed } from "vue";
// import { ItemService } from "../../services/item.service";
// import ItemPost from "./components/ItemPost.vue";
// import { DEFAULT_PAGE_SIZE } from "../../common/pagination-constants";
// import { GetItemsCursorBased } from "../../interfaces/item.interface";
import { localStorageKeys } from "../../../common/storage-keys";
import { MarketService } from "../../../services/market.service";
import { Campus, University } from "../../../interfaces/market.interface";
import { EnvironmentFilled } from "@ant-design/icons-vue";

const props = defineProps({
  campusLocationFilter: {
    type: Object as () => Campus | undefined,
    required: true,
  },
  universityFilter: {
    type: Object as () => University | undefined,
    required: false,
  },
});

const emit = defineEmits(["onFilter"]);

onMounted(async () => {
  // fetch all location options
  await getLocationOptions();

  // load campus location and university from local storage and emit filter
  await loadLocation();

});

const locationModal = ref<{
  visible: boolean;
  campusLocationSelect: Campus | undefined;
  universitySelect: University | undefined;
  locationOptions: Campus[] | undefined;
}>({
  visible: false,
  campusLocationSelect: undefined,
  universitySelect: undefined,
  locationOptions: undefined,
});

const getLocationOptions = async () => {
  try {
    locationModal.value.locationOptions = await MarketService.getAllCampuses();
  } catch (err) {
    console.log(err);
  }
};

/**
 * Load campus location and university from local storage. If not found,
 * apply filter by user's university and campus location
 */
const loadLocation = async () => {
  const userSearchCampusId: Ref<number | undefined> = computed(() => {
    const searchCampusId = localStorage.getItem(
      localStorageKeys.USER_SEARCH_CAMPUS_LOCATION
    );
    return searchCampusId ? +searchCampusId : undefined;
  });

  const userSearchUniversityId: Ref<number | undefined> = computed(() => {
    const searchUniversityId = localStorage.getItem(
      localStorageKeys.USER_SEARCH_UNIVERSITY
    );
    return searchUniversityId ? +searchUniversityId : undefined;
  });

  // select location
  locationModal.value.campusLocationSelect =
    locationModal.value.locationOptions?.find(
      (campus) => campus.id === userSearchCampusId.value
    );
  locationModal.value.universitySelect =
    locationModal.value.campusLocationSelect?.universities?.find(
      (university) => university.id === userSearchUniversityId.value
    );

  // emit filter to parent component
  emit("onFilter", {
    campusLocationSelect: locationModal.value.campusLocationSelect,
    universitySelect: locationModal.value.universitySelect,
  });
};

const showLocationModal = () => {
  locationModal.value.campusLocationSelect = props.campusLocationFilter;
  locationModal.value.universitySelect = props.universityFilter;
  locationModal.value.visible = true;
};

const selectCampusLocation = (campusLocationId: number | undefined) => {
  locationModal.value.campusLocationSelect =
    locationModal.value.locationOptions?.find(
      (campus) => campus.id === campusLocationId
    );
};

const selectUniversity = (universityId: number) => {
  locationModal.value.universitySelect =
    locationModal.value.campusLocationSelect?.universities?.find(
      (university) => university.id === universityId
    );
};

const applyFilterByLocation = async () => {
  try {
    emit("onFilter", {
      campusLocationSelect: locationModal.value.campusLocationSelect,
      universitySelect: locationModal.value.universitySelect,
    });
    locationModal.value.visible = false;

    // set user's new search campus location and university to local storage
    localStorage.setItem(
      localStorageKeys.USER_SEARCH_CAMPUS_LOCATION,
      props.campusLocationFilter?.id?.toString() || ""
    );
    localStorage.setItem(
      localStorageKeys.USER_SEARCH_UNIVERSITY,
      props.universityFilter?.id?.toString() || ""
    );
  } catch (err) {
    console.log(err);
  }
};
</script>
<template>
  <a-button
    type="link"
    @click="showLocationModal"
    v-if="campusLocationFilter"
    class="mb-16"
    :style="{ padding: '0px' }"
  >
    <environment-filled /><span>{{ campusLocationFilter.campusName }} </span
    ><span v-if="universityFilter">
      &nbsp;· {{ universityFilter.universityName }}</span
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
        :options="locationModal.locationOptions"
        @change="selectCampusLocation"
      >
        <a-select-option
          v-for="campus in locationModal.locationOptions"
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
        :options="locationModal.campusLocationSelect?.universities"
        :allow-clear="true"
        @change="selectUniversity"
      ></a-select>
    </div>
  </a-modal>
</template>
<style></style>
<!-- class="logo" -->
