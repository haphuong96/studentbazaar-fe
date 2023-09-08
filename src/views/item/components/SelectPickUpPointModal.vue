<template>
  <a-button type="link" @click="showDeliveryLocationModal"
    ><environment-filled /><span v-if="!deliveryLocationSelectWatch"
      >Select Pick Up Location</span
    >
    <span v-else>{{ deliveryLocationSelectWatch?.name }}</span></a-button
  >
  <a-modal
    v-model:visible="deliveryLocation.modalVisible"
    title="Pick Up Point"
    :maskClosable="false"
    :footer="null"
  >
    <div>
      <!-- d-flex justify-between mb-16 -->
      <div class="mb-8">Campus location</div>
      <a-select
        :value="modalSearch.campusLocation?.id"
        show-search
        placeholder="[All]"
        style="width: 200px"
        :filter-option="true"
        :allow-clear="true"
        @change="selectCampusLocationModal"
      >
        <a-select-option
          v-for="campus in campusLocationOptions"
          :key="campus.id"
          :value="campus.id"
        >
          {{ campus.campusName }}
        </a-select-option>
      </a-select>
      <div class="mb-8 mt-16">University</div>
      <a-select
        :value="modalSearch.university?.id"
        show-search
        placeholder="[All]"
        style="width: 200px"
        :allow-clear="true"
        @change="selectUniversityModal"
      >
        <a-select-option
          v-for="university in universityOptions"
          :key="university.id"
          :value="university.id"
        >
          {{ university.universityName }}
        </a-select-option>
      </a-select>
      <a-list
        size="small"
        bordered
        :data-source="deliveryLocation.deliveryLocationOptions"
        item-layout="horizontal"
        v-if="deliveryLocation.deliveryLocationOptions"
        class="mt-32"
      >
        <template #renderItem="{ item }">
          <a-list-item
            ><a @click="() => selectDeliveryLocation(item)">
              <div>
                {{ item.name }}
              </div>
              <div>
                {{ item.address }}
              </div>
            </a>
          </a-list-item>
        </template>
      </a-list>
      <!-- <a-pagination
                size="small"
                v-model:current="current"
                :total="totalMyCollections"
                show-less-items
                @change="(page, pageSize) => fetchMyCollections(page, pageSize)"
              /> -->
    </div>
  </a-modal>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import {
  Campus,
  PickUpLocation,
  University,
} from "../../../interfaces/market.interface";
import { SelectProps } from "ant-design-vue";
import { MarketService } from "../../../services/market.service";
import { EnvironmentFilled } from "@ant-design/icons-vue";

const props = defineProps({
  deliveryLocationSelect: {
    type: Object as () => PickUpLocation | undefined,
    required: false,
  },
});

const emit = defineEmits(["onSelect"]);

const deliveryLocationSelectWatch = computed(() => {
  console.log("delivery location select ", props.deliveryLocationSelect);
  return props.deliveryLocationSelect;
});

const campusLocationOptions = ref<Campus[]>([]);
const universityOptions = ref<SelectProps["options"]>([]);

const modalSearch = ref<{
  campusLocation: Campus | undefined;
  university: University | undefined;
}>({
  campusLocation: undefined,
  university: undefined,
});

const deliveryLocation = ref<{
  modalVisible: boolean;
  deliveryLocationOptions: PickUpLocation[];
}>({
  modalVisible: false,
  deliveryLocationOptions: [],
});

const selectDeliveryLocation = async (
  location: PickUpLocation | null
): Promise<void> => {
  emit("onSelect", location);
//   deliveryLocation.value.selectedDeliveryLocation = location;
  deliveryLocation.value.modalVisible = false;
};

const selectCampusLocationModal = async (
  campusLocationId: number | undefined
) => {
  console.log("inside selectCampusLocationModal", campusLocationId);
  modalSearch.value.campusLocation = (
    campusLocationOptions.value as Campus[]
  ).find((campus) => campus.id === campusLocationId);
  console.log("campus location options", campusLocationOptions.value);

  universityOptions.value = modalSearch.value.campusLocation?.universities;

  console.log("university options", universityOptions.value);

  // reset university select choice
  modalSearch.value.university = undefined;

  await searchDeliveryLocation();
};

const selectUniversityModal = async (universityId: number | undefined) => {
  console.log("inside selectUniversityModal", universityId);
  console.log(
    "inside selectUniversityModal university options",
    universityOptions.value
  );
  modalSearch.value.university = (universityOptions.value as University[]).find(
    (university) => university.id === universityId
  );

  await searchDeliveryLocation();
};

const searchDeliveryLocation = async () => {
  deliveryLocation.value.deliveryLocationOptions =
    await MarketService.getAllDeliveryLocations({
      campusLocationId: modalSearch.value.campusLocation?.id,
      universityId: modalSearch.value.university?.id,
    });
};

const showDeliveryLocationModal = async (): Promise<void> => {
  await getAllCampusLocations();
  deliveryLocation.value.modalVisible = true;
};
const getAllCampusLocations = async (): Promise<void> => {
  campusLocationOptions.value = await MarketService.getAllCampuses();
  console.log("campusLocationOptions ", campusLocationOptions.value);
};

onMounted(async () => {
  await getAllCampusLocations();
  await selectCampusLocationModal(
    deliveryLocationSelectWatch.value?.campusLocation?.id
  );
  await selectUniversityModal(
    deliveryLocationSelectWatch.value?.university?.id
  );
});
</script>
