<template>
  <div
    :class="[!isMine ? 'message' : 'mine-message']"
    @click="isShowTime = true"
  >
    <a-image :height="160" :width="160" v-if="type === 'image'" :src="text"></a-image>
    <div v-else>{{ text }}</div>
    <div v-show="isShowTime">{{ formatFromNow(time) }}</div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { User } from "../../../interfaces/user.interface";
import { formatFromNow } from "../../../utils/datetime.util";

defineProps({
  author: {
    type: Object as () => User,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  isMine: {
    type: Boolean,
    required: true,
  },
});

const isShowTime = ref<boolean>(false);
</script>
<style lang="css" scoped>
.message {
  background: #e7e7e7;
  border-radius: 10px;
  padding: 1rem;
  width: fit-content;
  margin-top: 8px;
}

.mine-message {
  background: #e5efff;
  color: black;
  border-radius: 10px;
  padding: 1rem;
  width: fit-content;
  margin-top: 8px;
}

.message-auth-name {
  font-size: 16px;
  font-weight: 600;
}

.message.dark {
  background: #e9eaf6;
}

h5 {
  margin: 0 0 0.5rem 0;
}

:deep(.ant-image) {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

:deep(.ant-image > .ant-image-img) {
  object-fit: cover !important;
  width: calc(160px - 2px);
  height: calc(160px - 2px);
}
</style>
