<template>
  <div class="list-image-preview-container">
    <ul>
      <li v-for="(source, index) in sources" :key="index">
        {{ source?.name }}
      </li>
    </ul>
    <img
      class="list-image-preview-container__img"
      v-if="sources"
      v-for="(source, index) in sources"
      :src="source?.toString() || ''"
      :key="index"
      alt="Selected Image"
    />
  </div>
</template>

<script setup lang="ts">
interface ListImagePreviewProps {
  sources: any;
}
// Define props
defineProps<ListImagePreviewProps>();
</script>
<style lang="css" scoped>
.list-image-preview-container {
  display: flex;
  height: 80px;
  width: 500px;
  background-color: green;
}

.list-image-preview-container__img {
  width: 80px;
  height: 80px;
  background-color: red;
  margin: 8px;
  object-fit: scale-down;
}
</style>
