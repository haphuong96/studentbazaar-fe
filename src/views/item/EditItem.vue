<template>
  <a-row>
    <a-col :span="12" class="pr-32">
      <h2>Add images</h2>
      <div class="clearfix">
        <ImagePicker @image-selected="onImageSelected"></ImagePicker>
        <ListImagePreview :sources="preview"></ListImagePreview>
      </div>
    </a-col>
    <a-col :span="12">
      <h2>List your item</h2>
    </a-col>
  </a-row>
  <!-- List Item -->
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import ImagePicker from "./components/ImagePicker.vue";
import ListImagePreview from "./components/ListImagePreview.vue";
const sources = ref<any[]>([]);
const preview = computed(() => {
  return sources.value.map((s) => s.data);
});
const onImageSelected = (images: any[]) => {
  sources.value.push(images);
};
</script>
<style scoped></style>
<!-- class="logo" -->
