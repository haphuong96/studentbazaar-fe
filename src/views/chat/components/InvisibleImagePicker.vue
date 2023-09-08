<template>
  <div class="invisible-image-picker" @click="selectFile">
    <input
      :id="id"
      class="invisible-image-picker__input"
      type="file"
      @change="handleImageChange"
      accept="image/*"
      multiple
    />
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// import { v4 as uuidv4 } from "uuid";
import { onMounted, ref } from "vue";
const id = ref<string>("");
const emits = defineEmits(["imageSelected"]);
onMounted(() => {
  id.value = 'uuidv4();'
});

const handleImageChange = (event: any) => {
  const files = event.target.files;
  if (files?.length) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.includes("image")) {
        const reader = new FileReader();
        reader.onload = () => {
          const image = {
            data: reader.result,
            name: file.name,
            id: 'uuidv4();',
            origin: file,
          };
          emits("imageSelected", image);
        };
        reader.readAsDataURL(file);
      }
    }
  }
  event.target.value = "";
};

const selectFile = () => {
  const input = document.getElementById(id.value);
  if (!input) return;
  input.click();
};
</script>
<style lang="css" scoped>
.invisible-image-picker {
  width: auto;
  height: auto;
}

.invisible-image-picker__input {
  width: 0;
  height: 0;
  display: none;
}
</style>
