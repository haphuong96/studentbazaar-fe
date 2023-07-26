<template>
  <a-row>
    <a-col :span="12" class="pr-32">
      <h2>Add images</h2>
      <div>{{ fileList }}</div>
      <div class="clearfix">
        <!-- <a-image-preview-group> -->
        <a-upload-dragger
          class="my-16"
          v-model:file-list="fileList"
          list-type="picture-card"
          @preview="handlePreview"
          :before-upload="beforeUpload"
          @remove="handleRemove"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        >
          <div v-if="fileList ? fileList.length < 4 : false">
            <plus-outlined />
            <div style="margin-top: 8px">Upload</div>
          </div>

          <!-- <template #itemRender="{ file, actions }">
              <span>
                <close-circle-outlined @click="actions.remove" />
                <a-image
                  :src="file.thumbUrl"
                  :preview="file.preview"
                  :alt="file.name"
                  style="width: 100%"
                ></a-image>
              </span>
            </template> -->
        </a-upload-dragger>
        <!-- </a-image-preview-group> -->
        <!-- <a-button
          type="primary"
          :disabled="fileList.length === 0"
          :loading="uploading"
          style="margin-top: 16px"
          @click="handleUpload"
        >
          {{ uploading ? "Uploading" : "Start Upload" }}
        </a-button> -->
        <a-modal
          v-model:visible="previewVisible"
          :title="previewTitle"
          :footer="null"
          @cancel="handleCancel"
        >
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </div>
      <!-- <div>{{ fileList }}</div> -->
      <!-- <div class="clearfix">
        <a-upload
          v-model:file-list="fileList"
          list-type="picture-card"

          :before-upload="beforeUpload"
          @remove="handleRemove"
        >
          <div v-if="fileList.length < 8">
            <plus-outlined />
            <div style="margin-top: 8px">Upload</div>
          </div>
          <a-button>
            <upload-outlined></upload-outlined>
            Select File
          </a-button>
        </a-upload>
        <a-button
          type="primary"
          :disabled="fileList.length === 0"
          :loading="uploading"
          style="margin-top: 16px"
          @click="handleUpload"
        >
          {{ uploading ? "Uploading" : "Start Upload" }}
        </a-button>
      </div> -->
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
import router from "../../router";
import { routeNames } from "../../router/route-names";
import { CloseCircleOutlined } from "@ant-design/icons-vue";

const formState: Ref<CreateItemDto> = ref({
  itemName: undefined,
  itemDescription: undefined,
  price: undefined,
  categoryId: undefined,
  conditionId: undefined,
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

const uploadItemImages = async () => {
  const formData = new FormData();
  fileList.value?.forEach((file: UploadProps["fileList"][number]) => {
    console.log('file', file)
    formData.append('files', file);
      // "files", file as any);
  });

  formData.set('test', 'testvalue');
  console.log('form values',  formData.getAll('files') )
  try {
  await ItemService.uploadItemImages(formData);

  // You can use any AJAX library you like
  // request("https://www.mocky.io/v2/5cc8019d300000980a055e76", {
  //   method: "post",
  //   data: formData,
  // })
  //   .then(() => {
  //     fileList.value = [];
  //     uploading.value = false;
  //     message.success("upload successfully.");
  //   })
  //   .catch(() => {
  //     uploading.value = false;
  //     message.error("upload failed.");
  //   });
    message.success("Item images uploaded successfully");
  } catch (error) {
    console.log(error);
  }
};

const onUpload = async (): Promise<void> => {
  uploading.value = true;
  // upload images to azure
  uploadItemImages();
  // upload item and store in db
  // uploadItem();

  uploading.value = false;
  router.push({ name: routeNames.MARKETPLACE_HOME });
};

//
import { PlusOutlined } from "@ant-design/icons-vue";
import { ref } from "vue";
import type { UploadProps } from "ant-design-vue";

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

const handleUpload = () => {
  const formData = new FormData();
  fileList.value.forEach((file: UploadProps["fileList"][number]) => {
    formData.append("files[]", file as any);
  });
  uploading.value = true;

  // You can use any AJAX library you like
  request("https://www.mocky.io/v2/5cc8019d300000980a055e76", {
    method: "post",
    data: formData,
  })
    .then(() => {
      fileList.value = [];
      uploading.value = false;
      message.success("upload successfully.");
    })
    .catch(() => {
      uploading.value = false;
      message.error("upload failed.");
    });
};
</script>
<style></style>
<!-- class="logo" -->
