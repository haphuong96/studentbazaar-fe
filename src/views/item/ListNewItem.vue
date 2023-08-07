<template>
  <a-row>
    <a-col :span="12" class="pr-32">
      <h2>Add images</h2>
      <!-- <img src="https://studentbazaar.blob.core.windows.net/item-images/354076998_171323875771236_7388431690475966556_n.jpg"/> -->
      <div class="clearfix">
        <a-upload-dragger
          v-model:file-list="fileList"
          class="my-16"
          list-type="picture-card"
          @preview="handlePreview"
          :before-upload="beforeUpload"
          @remove="handleRemove"
        >
          <div v-if="fileList ? fileList.length < 4 : false">
            <plus-outlined />
            <div style="margin-top: 8px">Upload</div>
          </div>
        </a-upload-dragger>
        <a-modal
          v-model:visible="previewVisible"
          :title="previewTitle"
          :footer="null"
          @cancel="handleCancel"
        >
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
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
        <a-form-item
          label="Pickup Point"
          v-if="deliveryLocation.selectedDeliveryLocation"
        >
          <a-button type="link" @click="showDeliveryLocationModal">
            <environment-filled />{{
              deliveryLocation.selectedDeliveryLocation?.name
            }}</a-button
          >
          <a-modal
            v-model:visible="deliveryLocation.modalVisible"
            title="Pick Up Point"
            :maskClosable="false"
            :footer="null"
          >
            <div>
              <!-- d-flex justify-between mb-16 -->
              <div>Campus</div>
              <a-select
                :value="searchValue.campusLocation?.id"
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
                :value="searchValue.university?.id"
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
              <a-list
                size="small"
                bordered
                :data-source="deliveryLocation.deliveryLocationOptions"
                item-layout="horizontal"
                v-if="deliveryLocation.deliveryLocationOptions"
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
          <a-button :loading="uploading" @click="onUpload" type="primary"
            >Upload</a-button
          >
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
  <!-- List Item -->
</template>
<script setup lang="ts">
import { SelectProps, TreeSelectProps, message } from "ant-design-vue";
import { computed, onMounted, ref, Ref } from "vue";
import { ItemService } from "../../services/item.service";
import { CreateItemDto } from "../../interfaces/item.interface";
import { PlusOutlined } from "@ant-design/icons-vue";
import type { UploadProps } from "ant-design-vue";
import router from "../../router";
import { routeNames } from "../../router/route-names";
import { PickUpLocation } from "../../interfaces/market.interface";
import { MarketService } from "../../services/market.service";
import { localStorageKeys } from "../../common/storage-keys";
import { EnvironmentFilled } from "@ant-design/icons-vue";
import { Campus } from "../../interfaces/market.interface";
import { University } from "../../interfaces/market.interface";

const userUniversityId = computed(() => {
  const universityId = localStorage.getItem(
    localStorageKeys.USER_UNIVERSITY_ID
  );
  return universityId ? +universityId : null;
});
const userCampusLocationId = computed(() => {
  const campusId = localStorage.getItem(localStorageKeys.USER_CAMPUS_ID);
  return campusId ? +campusId : null;
});
const userDefaultDeliveryLocationId = computed(() => {
  const locationId = localStorage.getItem(
    localStorageKeys.DEFAULT_PICKUP_LOCATION_ID
  );
  return locationId ? +locationId : null;
});

const formState: Ref<CreateItemDto> = ref({
  itemName: undefined,
  itemDescription: undefined,
  price: undefined,
  categoryId: undefined,
  conditionId: undefined,
  img: undefined,
  locationId: undefined,
});

const conditionOptions = ref<SelectProps["options"]>([]);
const categoryOptions = ref<TreeSelectProps["treeData"]>([]);
const campusLocationOptions = ref<SelectProps["options"] | Campus[]>([]);
const universityOptions = ref<SelectProps["options"]>([]);

const searchValue = ref<{
  campusLocation: Campus | undefined;
  university: University | undefined;
}>({
  campusLocation: undefined,
  university: undefined,
});

const deliveryLocation = ref<{
  modalVisible: boolean;
  deliveryLocationOptions: PickUpLocation[];
  selectedDeliveryLocation: PickUpLocation | null;
}>({
  modalVisible: false,
  deliveryLocationOptions: [],
  selectedDeliveryLocation: null,
});

onMounted(async () => {
  await Promise.all([
    getItemConditions(),
    getItemCategories(),
    getDefaultDeliveryLocation(),
    getAllCampusLocations(),
  ]);
  selectCampusLocation(userCampusLocationId.value as number);
  selectUniversity(userUniversityId.value as number);
});

const getItemConditions = async (): Promise<void> => {
  conditionOptions.value = await ItemService.getItemConditions();
};

const getItemCategories = async (): Promise<void> => {
  categoryOptions.value = await ItemService.getItemCategories();
};

const getDefaultDeliveryLocation = async (): Promise<void> => {
  deliveryLocation.value.selectedDeliveryLocation =
    await MarketService.getOneDeliveryLocation(
      userDefaultDeliveryLocationId.value
    );
};

const getAllCampusLocations = async (): Promise<void> => {
  campusLocationOptions.value = await MarketService.getAllCampuses();
};

const selectDeliveryLocation = async (
  location: PickUpLocation | null
): Promise<void> => {
  deliveryLocation.value.selectedDeliveryLocation = location;

  formState.value.locationId =
    deliveryLocation.value.selectedDeliveryLocation?.id;

  deliveryLocation.value.modalVisible = false;
};

const selectCampusLocation = async (campusLocationId: number) => {
  searchValue.value.campusLocation = (
    campusLocationOptions.value as Campus[]
  ).find((campus) => campus.id === campusLocationId);
  universityOptions.value = searchValue.value.campusLocation?.universities;

  await searchDeliveryLocation();
};

const selectUniversity = async (universityId: number) => {
  searchValue.value.university = (universityOptions.value as University[]).find(
    (university) => university.id === universityId
  );

  await searchDeliveryLocation();
};

const searchDeliveryLocation = async () => {
  deliveryLocation.value.deliveryLocationOptions =
    await MarketService.getAllDeliveryLocations({
      campusLocationId: searchValue.value.campusLocation?.id,
      universityId: searchValue.value.university?.id,
    });
};

const showDeliveryLocationModal = async (): Promise<void> => {
  await getAllCampusLocations();
  deliveryLocation.value.modalVisible = true;
};

const uploadItem = async (): Promise<void> => {
  try {
    await ItemService.uploadItem(formState.value);
    message.success("Item uploaded successfully");
  } catch (error) {
    console.log(error);
  }
};

const onUpload = async (): Promise<void> => {
  uploading.value = true;
  // upload item images
  await uploadItemImages();

  //upload item
  await uploadItem();
  uploading.value = false;

  router.push({ name: routeNames.MARKETPLACE_HOME });
};

const uploadItemImages = async () => {
  const formData = new FormData();
  fileList.value?.forEach((file: UploadProps["fileList"][number]) => {
    formData.append("files", file.originFileObj);
  });
  try {
    formState.value.img = await ItemService.uploadItemImages(formData);
    message.success("Item images uploaded successfully");
  } catch (error) {
    console.log(error);
  }
};

//

function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
const previewVisible = ref(false);
const previewImage = ref("");
const previewTitle = ref("");
const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = "";
};
const handlePreview = async (file: UploadProps["fileList"][number]) => {
  if (!file.url && !file.preview) {
    file.preview = (await getBase64(file.originFileObj)) as string;
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value =
    file.name || file.url.substring(file.url.lastIndexOf("/") + 1);
  console.log(fileList.value);
  console.log(previewVisible.value);
};
const fileList = ref<UploadProps["fileList"]>([]);
const uploading = ref<boolean>(false);
const handleRemove: UploadProps["onRemove"] = (file) => {
  const index: number | undefined = fileList.value?.indexOf(file);
  const newFileList = fileList.value?.slice();
  newFileList?.splice(index, 1);
  fileList.value = newFileList;
};
const beforeUpload: UploadProps["beforeUpload"] = (file) => {
  console.log(file);
  fileList.value = [...(fileList.value || []), file];
  return false;
};
</script>
<style></style>
<!-- class="logo" -->
