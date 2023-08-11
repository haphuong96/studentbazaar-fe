<template>
  <a-image-preview-group>
    <div class="list-image-preview-container">
      <div
        class="list-image-preview-container__img-container"
        v-for="(source, index) in sources"
        :key="index"
      >
        <a-image
          v-if="sources"
          :src="source"
          :key="index"
          alt="Selected Image"
          :width="80"
          :height="80"
        >
        </a-image>
        <CloseCircleFilled
          class="list-image-preview-container__img-container__btn"
          @click="() => removeImage(index)"
        ></CloseCircleFilled>
      </div>
    </div>
  </a-image-preview-group>
</template>

<script setup lang="ts">
import { CloseCircleFilled } from "@ant-design/icons-vue";

interface ListImagePreviewProps {
  sources: any;
}
// Define props
defineProps<ListImagePreviewProps>();
const emits = defineEmits(["removeImage"]);

const removeImage = (index: number) => {
  emits("removeImage", index);
};
</script>
<style lang="css" scoped>
.list-image-preview-container {
  display: flex;
  height: 80px;
  width: 100%;
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

.list-image-preview-container__img-container {
  position: relative;
}

.list-image-preview-container__img-container__btn {
  position: absolute;
  right: 20px;
  top: 4px;
  font-size: 18px;
  color: gray;
  cursor: pointer;
}

:deep(.ant-image) {
  border: 1px solid #d9d9d9;
  margin-right: 16px;
  border-radius: 4px;
}

:deep(.ant-image > .ant-image-img) {
  object-fit: contain !important;
  width: 78px;
  height: 78px;
}
</style>
