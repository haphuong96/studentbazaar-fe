<template>
  <!-- Your component's template -->
  <div class="gallery-view-container">
    <div class="gallery-view-container__list-img">
      <img
        class="gallery-view-container__list-img__item"
        v-for="(item, index) in sources"
        :key="index"
        :src="item.imgPath"
        @click="selectPhoto = item.imgPath"
      />
    </div>
    <div class="gallery-view-container__preview_container">
      <a-image
        :src="selectPhoto"
        class="gallery-view-container__preview-photo"
      ></a-image>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { ItemImage } from "../interfaces/item.interface";

interface GalleryViewProps {
  sources: ItemImage[];
}
// Define props
const props = defineProps<GalleryViewProps>();
const selectPhoto = ref<string>(props.sources[0]?.imgPath || "");
watch(props, () => {
  selectPhoto.value = props.sources[0]?.imgPath || "";
  console.log("vap day ne");
});
</script>
<style lang="css" scoped>
.gallery-view-container {
  display: flex;
  width: 600px;
  height: 400px;
}

.gallery-view-container__preview_container {
  width: 100%;
  height: 100%;
  margin-left: 16px;
  overflow: hidden;
  border-radius: 8px;
  background-color: #EEEEEE;
  display: flex;
  justify-content: center;
  align-items: center;
}
.gallery-view-container__preview-photo {
  width: 100%;
  height: 100%;
}

.gallery-view-container__list-img {
  width: 96px;
  height: 100%;
  margin-bottom: 8px;
  overflow: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.gallery-view-container__list-img::-webkit-scrollbar {
  display: none;
}

.gallery-view-container__list-img__item {
  width: 100%;
  height: 64px;
  margin-bottom: 16px;
  border-radius: 4px;
  object-fit: cover;
  cursor: pointer;
  overflow: hidden;
}
</style>
