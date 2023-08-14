<template>
  <!-- Your component's template -->
  <div class="gallery-view-container">
    <div class="gallery-view-container__list-img">
      <img
        class="gallery-view-container__list-img__item"
        v-for="(img, index) in sources"
        :key="index"
        :src="img.thumbnailUrl"
        @click="selectPhoto = img.url"
      />
    </div>
    <a-image
      :src="selectPhoto"
      class="gallery-view-container__preview-photo"
      :width="488"
      :height="400"
    ></a-image>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { GetItemImage } from "../interfaces/item.interface";

interface GalleryViewProps {
  sources: GetItemImage[];
}
// Define props
const props = defineProps<GalleryViewProps>();
const selectPhoto = ref<string>(props.sources[0]?.url || "");
watch(props, () => {
  selectPhoto.value = props.sources[0]?.url || "";
});
</script>
<style lang="css" scoped>
.gallery-view-container {
  display: flex;
  width: 600px;
  height: 400px;
}

.gallery-view-container__preview-photo {
  margin-left: 16px;
  width: calc(100% - 112px);
  height: 100%;
  object-fit: cover;
  align-items: center;
  margin-left: 16px;
}

.gallery-view-container__list-img {
  margin-right: 16px;
  width: 96px;
  height: 100%;
  margin-bottom: 8px;
  overflow: scroll;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.gallery-view-container__list-img::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.gallery-view-container__list-img {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.gallery-view-container__list-img__item {
  width: 96px;
  height: 64px;
  margin-bottom: 16px;
  object-fit: cover;
  cursor: pointer;
}

.gallery-view-container__preview-photo .ant-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Set your desired object-fit behavior (e.g., cover, contain, etc.) */
}

:deep(.ant-image .ant-image-img) {
  width: 100%;
  height: 100%;
  object-fit: cover !important;
}
</style>
