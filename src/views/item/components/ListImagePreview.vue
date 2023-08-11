<template>
  <div class="list-image-preview-container">
    <a-image-preview-group>
      <a-image
        v-if="sources"
        v-for="(source, index) in sources"
        :src="source"
        :key="index"
        alt="Selected Image"
        :width="80"
        :height="80"
      >
        <div slot="previewMask">Nghia</div>
      </a-image>
    </a-image-preview-group>
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
  width: 400px;
  margin-top: 16px;
  overflow: scroll;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.list-image-preview-container::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.list-image-preview-container {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

:deep(.ant-image) {
  border: 1px solid lightgray;
  margin-right: 16px;
}

:deep(.ant-image > .ant-image-img) {
  object-fit: contain !important;
  width: 78px;
  height: 78px;
}
</style>
