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
        <a-form-item label="Title">
          <a-input
            v-model:value="formState.itemName"
            placeholder="e.g Introduction to Computer Science textbook"
            show-count
            :maxlength="100"
          />
        </a-form-item>
        <a-form-item label="Price">
          <a-input-number
            v-model:value="formState.price"
            prefix="£"
            style="width: 100%"
            def
          />
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
        <a-form-item label="Description (Optional)">
          <a-textarea
            v-model:value="formState.itemDescription"
            placeholder="Write some description..."
          />
        </a-form-item>
        <a-form-item label="Pickup Point" v-if="!isOnPageLoading">
          <SelectPickUpPointModal 
            :delivery-location-select="selectedDeliveryLocation"
            @on-select="onSelectPickUpPoint"
          ></SelectPickUpPointModal>
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
import { UserService } from "../../services/user.service";
import SelectPickUpPointModal from "./components/SelectPickUpPointModal.vue";
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
  price: 0,
  categoryId: undefined,
  conditionId: undefined,
  images: [],
  locationId: computed(() => {
    return selectedDeliveryLocation.value?.id;
  }),
  status: undefined,
});

const conditionOptions = ref<SelectProps["options"]>([]);
const categoryOptions = ref<TreeSelectProps["treeData"]>([]);

const selectedDeliveryLocation = ref<PickUpLocation | undefined>(undefined);

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
  ]);
  getDefaultDeliveryLocation();
  isOnPageLoading.value = false;
  console.log(isOnPageLoading.value)
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
  selectedDeliveryLocation.value =
    me.value.defaultDeliveryLocation ||
    me.value.suggestedDeliveryLocations?.[0];
  console.log('selected delivery location ', selectedDeliveryLocation.value)
};

const onSelectPickUpPoint = (location: PickUpLocation | undefined): void => {
  selectedDeliveryLocation.value = location;
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
