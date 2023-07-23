<template>
  <a-row>
    <a-col :span="12">
      <h2>Add images</h2>
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
          <a-button @click="onUpload" type="primary">Upload</a-button>
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

const onUpload = async (): Promise<void> => {
  uploadItem();
  router.push({ name: routeNames.MARKETPLACE_HOME });
};
</script>
<style></style>
<!-- class="logo" -->
