<template>
  <a-row>
    <a-col :span="12" class="pr-32">
      <h2>Add images</h2>
      <div class="image-picker">
        <ImagePicker @image-selected="onImageSelected"></ImagePicker>
        <ListImagePreview
          :sources="preview"
          @remove-image="onImageRemoved"
        ></ListImagePreview>
      </div>
    </a-col>
    <a-col :span="12">
      <h2>List your item</h2>
      <button @click="uploadItemImages">Upload</button>
    </a-col>
  </a-row>
  <!-- List Item -->
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { ItemService } from "../../services/item.service";
import ImagePicker from "./components/ImagePicker.vue";
import ListImagePreview from "./components/ListImagePreview.vue";
const sources = ref<any[]>([]);
const preview = computed(() => {
  return sources.value.map((s) => s.data);
});
const onImageSelected = (images: any[]) => {
  sources.value.push(images);
};

const onImageRemoved = (index: number) => {
  sources.value.splice(index, 1);
};

const uploadItemImages = async () => {
  const formData = new FormData();
  sources.value?.forEach((s) => {
    formData.append("files", s.origin);
  });
  try {
    await ItemService.uploadItemImages(formData);
  } catch (error) {
    console.log(error);
  }
};
</script>
<style scoped>
.image-picker {
  width: 400px;
}
</style>
