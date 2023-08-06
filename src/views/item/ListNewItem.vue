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
        <a-form-item label="Pickup Point">
          <!-- <a-select
            v-model:value="formState.conditionId"
            :options="conditionOptions"
            placeholder="Select condition"
            :fieldNames="{
              label: 'conditionName',
              value: 'id',
            }"
          >
          </a-select> -->
          <a-button type="link" @click="showAddToCollectionModal"
            ></a-button
          >
          <a-modal
            v-model:visible="AddToCollectionVisible"
            title="Add To Your Collection"
            :maskClosable="false"
            :footer="null"
          >
            <div class="d-flex justify-between mb-16">
              <a-input-search
                v-model:value="searchMyCollectionKeyword"
                placeholder="Search your collection"
                style="width: 250px"
                @search="() => fetchMyCollections()"
              />
              <a-pagination
                size="small"
                v-model:current="current"
                :total="totalMyCollections"
                show-less-items
                @change="(page, pageSize) => fetchMyCollections(page, pageSize)"
              />
            </div>
            <a-list
              size="small"
              bordered
              :data-source="myCollections"
              item-layout="horizontal"
              v-if="myCollections"
            >
              <template #renderItem="{ item }">
                <a-list-item
                  ><a @click="addToMyCollection(item.collection_id)">
                    {{ item.collection_name }}</a
                  >
                </a-list-item>
              </template>
              <template #header>
                <div>
                  <a @click="addToMyNewCollection"
                    ><b>
                      <PlusCircleFilled></PlusCircleFilled> Create a new
                      collection</b
                    ></a
                  >
                </div>
              </template>
            </a-list>
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
import { onMounted, ref, Ref } from "vue";
import { ItemService } from "../../services/item.service";
import { CreateItemDto } from "../../interfaces/item.interface";
import { PlusOutlined } from "@ant-design/icons-vue";
import type { UploadProps } from "ant-design-vue";
import router from "../../router";
import { routeNames } from "../../router/route-names";
// import { Image } from "../../interfaces/image.interface";

const formState: Ref<CreateItemDto> = ref({
  itemName: undefined,
  itemDescription: undefined,
  price: undefined,
  categoryId: undefined,
  conditionId: undefined,
  img: undefined,
});

const conditionOptions = ref<SelectProps["options"]>([]);
const categoryOptions = ref<TreeSelectProps["treeData"]>([]);

onMounted(async () => {
  Promise.all([getItemConditions(), getItemCategories()]);
});

const getItemConditions = async (): Promise<void> => {
  conditionOptions.value = await ItemService.getItemConditions();
};

const getItemCategories = async (): Promise<void> => {
  categoryOptions.value = await ItemService.getItemCategories();
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
  formData.set("test", "testvalue");
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
