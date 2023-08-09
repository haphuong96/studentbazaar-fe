<template>
  <div class="image-picker">
    <input type="file" @change="handleImageChange" accept="image/*" />
    <img v-if="selectedImage" :src="selectedImage" alt="Selected Image" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const selectedImage = ref<any | undefined>();
const emits = defineEmits(["onChange"]);

const handleImageChange = (event: any) => {
  const file = event.target.files[0];
  if (file && file.type.includes("image")) {
    const reader = new FileReader();
    reader.onload = () => {
      emits("onChange", { name: file.name, data: reader.result });
    };
    reader.readAsDataURL(file);
  }
};
</script>
<style lang="css" scoped>
.image-picker {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
</style>
