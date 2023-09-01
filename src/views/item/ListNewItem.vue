<template>
  <a-row>
    <a-col :span="12" class="pr-32">
      <h2>Add images</h2>
      <div class="list-new-item__list-image-preview">
        <ListImagePreview :sources="preview" @remove-image="onImageRemoved">
          <ImagePicker
            @image-selected="onImageSelected"
            class="list-new-item__image-picker"
          ></ImagePicker>
        </ListImagePreview>
      </div>
    </a-col>
    <a-col :span="12">
      <h2>List your item</h2>
      <a-form layout="vertical" :model="formState">
        <a-form-item label="Name">
          <a-input v-model:value="formState.itemName" placeholder="name" />
        </a-form-item>
        <a-form-item label="Price">
          <a-input v-model:value="formState.price" placeholder="price" />
        </a-form-item>

        <a-form-item label="Category">
          <a-tree-select
            v-model:value="formState.categoryId"
            show-search
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="Select category"
            allow-clear
            tree-default-expand-all
            :fieldNames="{
              children: 'children',
              label: 'categoryName',
              value: 'id',
            }"
            :tree-data="categoryOptions"
            tree-node-filter-prop="label"
          >
          </a-tree-select>
        </a-form-item>
        <a-form-item label="Condition">
          <a-select
            v-model:value="formState.conditionId"
            :options="conditionOptions"
            placeholder="Select condition"
            :fieldNames="{
              label: 'conditionName',
              value: 'id',
            }"
          >
          </a-select>
        </a-form-item>
        <a-form-item label="Description">
          <a-textarea
            v-model:value="formState.itemDescription"
            placeholder="Write some description"
          />
        </a-form-item>
        <a-form-item label="Pickup Point">
          <a-button type="link" @click="showDeliveryLocationModal"
            ><environment-filled /><span
              v-if="
                !deliveryLocation.selectedDeliveryLocation && !isOnPageLoading
              "
              >Select Pick Up Location</span
            >
            <span v-else>{{
              deliveryLocation.selectedDeliveryLocation?.name
            }}</span></a-button
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
        </a-form-item>
        <a-form-item>
          <span>
            <a-button :loading="uploading" @click="() => onUpload(true)"
              >Save Draft</a-button
            ></span
          >
          <span class="ml-32">
            <a-button
              :loading="uploading"
              @click="() => onUpload()"
              type="primary"
              >Upload</a-button
            ></span
          >
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
  <!-- List Item -->
</template>
<script setup lang="ts">
import { EnvironmentFilled } from "@ant-design/icons-vue";
import { SelectProps, TreeSelectProps, message } from "ant-design-vue";
import { Ref, computed, onMounted, ref } from "vue";
import { CreateItemDto, ItemStatus } from "../../interfaces/item.interface";
import {
  Campus,
  PickUpLocation,
  University,
} from "../../interfaces/market.interface";
import { User } from "../../interfaces/user.interface";
import router from "../../router";
import { routeNames } from "../../router/route-names";
import { ItemService } from "../../services/item.service";
import { MarketService } from "../../services/market.service";
import { UserService } from "../../services/user.service";

import ImagePicker from "./components/ImagePicker.vue";
import ListImagePreview from "./components/ListImagePreview.vue";

const me = ref<{
  university: University | undefined;
  campusLocation: Campus | undefined;
  defaultDeliveryLocation: PickUpLocation | undefined;
  suggestedDeliveryLocations: PickUpLocation[] | undefined;
}>({
  university: undefined,
  campusLocation: undefined,
  defaultDeliveryLocation: undefined,
  suggestedDeliveryLocations: undefined,
});

const formState: Ref<CreateItemDto> = ref({
  itemName: undefined,
  itemDescription: undefined,
  price: undefined,
  categoryId: undefined,
  conditionId: undefined,
  images: [],
  locationId: computed(() => {
    return deliveryLocation.value.selectedDeliveryLocation?.id;
  }),
  status: undefined,
});

const conditionOptions = ref<SelectProps["options"]>([]);
const categoryOptions = ref<TreeSelectProps["treeData"]>([]);
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
  selectedDeliveryLocation: PickUpLocation | null | undefined;
}>({
  modalVisible: false,
  deliveryLocationOptions: [],
  selectedDeliveryLocation: null,
});

const isOnPageLoading: Ref<boolean> = ref<boolean>(true);

const sources = ref<any[]>([]);
const preview = computed(() => {
  return sources.value.map((s) => s.data);
});

onMounted(async () => {
  await Promise.all([
    getMyProfile(),
    getItemConditions(),
    getItemCategories(),
    getAllCampusLocations(),
  ]);
  getDefaultDeliveryLocation(),
    await selectCampusLocationModal(me.value.campusLocation?.id);
  await selectUniversityModal(me.value.university?.id);
  isOnPageLoading.value = false;
});

const onImageSelected = (images: any[]) => {
  sources.value.push(images);
};

const onImageRemoved = (index: number) => {
  sources.value.splice(index, 1);
};

const getMyProfile = async (): Promise<void> => {
  const user: User = await UserService.getMyProfile();
  if (user) {
    me.value.university = user.university;
    me.value.campusLocation = user.campus;
    me.value.defaultDeliveryLocation = user.defaultPickUpPoint;
    me.value.suggestedDeliveryLocations = user.suggestedPickUpPoints;
  }
};

const getItemConditions = async (): Promise<void> => {
  conditionOptions.value = await ItemService.getItemConditions();
};

const getItemCategories = async (): Promise<void> => {
  categoryOptions.value = await ItemService.getItemCategories();
};

const getDefaultDeliveryLocation = (): void => {
  deliveryLocation.value.selectedDeliveryLocation =
    me.value.defaultDeliveryLocation ||
    me.value.suggestedDeliveryLocations?.[0];
};

const getAllCampusLocations = async (): Promise<void> => {
  campusLocationOptions.value = await MarketService.getAllCampuses();
};

const selectDeliveryLocation = async (
  location: PickUpLocation | null
): Promise<void> => {
  deliveryLocation.value.selectedDeliveryLocation = location;
  deliveryLocation.value.modalVisible = false;
};

const selectCampusLocationModal = async (
  campusLocationId: number | undefined
) => {
  modalSearch.value.campusLocation = (
    campusLocationOptions.value as Campus[]
  ).find((campus) => campus.id === campusLocationId);
  universityOptions.value = modalSearch.value.campusLocation?.universities;
  // reset university select choice
  modalSearch.value.university = undefined;

  await searchDeliveryLocation();
};

const selectUniversityModal = async (universityId: number | undefined) => {
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

const uploadItem = async (): Promise<void> => {
  try {
    // prepare images
    sources.value?.forEach((s) => {
    formState.value.images.push(s.origin);
    // append("files", s.origin);
  });

    await ItemService.uploadItem(formState.value);
    message.success("Item uploaded successfully");
  } catch (error) {
    console.log(error);
  }
};

const onUpload = async (isDraft: boolean = false): Promise<void> => {
  formState.value.status = isDraft ? ItemStatus.DRAFT : ItemStatus.PUBLISHED;

  uploading.value = true;
  // // upload item images
  // await uploadItemImages();

  //upload item
  await uploadItem();
  uploading.value = false;

  router.push({ name: routeNames.MY_ITEMS });
};

// const uploadItemImages = async () => {
//   const formData = new FormData();
//   sources.value?.forEach((s) => {
//     formData.append("files", s.origin);
//   });
//   try {
//     formState.value.img = await ItemService.uploadItemImages(formData);
//     message.success("Item images uploaded successfully");
//   } catch (error) {
//     console.log(error);
//   }
// };
const uploading = ref<boolean>(false);
</script>
<style>
.list-new-item__list-image-preview {
  width: 100%;
  max-width: calc(5 * (160px + 16px));
}

.list-new-item__image-picker {
  margin-right: 16px;
  width: 160px;
  height: 160px;
  max-width: 160px;
  max-height: 160px;
  margin-bottom: 16px;
}
</style>
