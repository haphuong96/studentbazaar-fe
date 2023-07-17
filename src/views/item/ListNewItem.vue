<template>
  <a-row>
    <a-col :span="12"> test1 </a-col>
    <a-col :span="12">
      <h2>List your item</h2>
      <a-form layout="vertical" :model="formState">
        <a-form-item label="Name">
          <a-input v-model:value="formState.name" placeholder="name" />
        </a-form-item>
        <a-form-item label="Price">
          <a-input v-model:value="formState.price" placeholder="price" />
        </a-form-item>
        <a-form-item label="Category">
          <a-select v-model:value="formState.categoryId">
            <a-select-option value="demo">Demo</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Condition">
          <a-select
            v-model:value="formState.conditionId"
            :options="conditionOptions"
          >
            <a-select-option value="demo">Demo</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Description">
          <a-textarea />
        </a-form-item>
        <a-form-item>
          <a-button type="primary">Upload</a-button>
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
  <!-- List Item -->
</template>
<script setup lang="ts">
import { SelectProps } from "ant-design-vue";
import { onMounted, ref, Ref } from "vue";
import { ItemService } from "../../services/item.service";

interface FormState {
  name: string | undefined;
  price: number | undefined;
  description: string | undefined;
  categoryId: number | undefined;
  conditionId: number | undefined;
}

const formState: Ref<FormState> = ref({
  name: undefined,
  price: undefined,
  description: undefined,
  categoryId: undefined,
  conditionId: undefined,
});

const conditionOptions = ref<SelectProps["options"]>([]);

onMounted(async () => {
    Promise.all([getItemConditions()]);
});

const getItemConditions = async () : Promise<void> => {
  const data = await ItemService.getItemConditions();
  conditionOptions.value = data.map((itemCondition) => {
    return {
      value: itemCondition.id,
      label: itemCondition.conditionName,
    };
  });
};
</script>
<style></style>
<!-- class="logo" -->
