<template>
  <div class="image-picker" @click="selectFile">
    <input
      :id="id"
      class="image-picker__input"
      type="file"
      @change="handleImageChange"
      accept="image/*"
      multiple
    />
    <PlusOutlined></PlusOutlined>
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { onMounted, ref } from "vue";
import { PlusOutlined } from "@ant-design/icons-vue";
const id = ref<string>("");
const emits = defineEmits(["imageSelected"]);
onMounted(() => {
  id.value = uuidv4();
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
            url: URL.createObjectURL(file),
          };
          emits("imageSelected", image);
        };
        reader.readAsDataURL(file);
      }
    }
  }
};

const selectFile = () => {
  const input = document.getElementById(id.value);
  if (!input) return;
  input.click();
};
</script>
<style lang="css" scoped>
.image-picker {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  gap: 10px;
  cursor: pointer;
  height: 96px;
  width: 400px;
  background-color: lightgray;
  background-image: repeating-linear-gradient(
      1deg,
      #8f8f8f,
      #8f8f8f 6px,
      transparent 6px,
      transparent 14px,
      #8f8f8f 14px
    ),
    repeating-linear-gradient(
      91deg,
      #8f8f8f,
      #8f8f8f 6px,
      transparent 6px,
      transparent 14px,
      #8f8f8f 14px
    ),
    repeating-linear-gradient(
      181deg,
      #8f8f8f,
      #8f8f8f 6px,
      transparent 6px,
      transparent 14px,
      #8f8f8f 14px
    ),
    repeating-linear-gradient(
      271deg,
      #8f8f8f,
      #8f8f8f 6px,
      transparent 6px,
      transparent 14px,
      #8f8f8f 14px
    );
  background-size: 2px 100%, 100% 2px, 2px 100%, 100% 2px;
  background-position: 0 0, 0 0, 100% 0, 0 100%;
  background-repeat: no-repeat;
  border-radius: 4px;
}

.image-picker__input {
  width: 0;
  height: 0;
  display: none;
}
</style>
