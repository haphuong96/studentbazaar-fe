<template>
  <div class="d-flex flex-col">
    <div v-for="message in user?.messages" :class="`d-flex ${message.fromSelf ? 'justify-right' : '' }`">
      <Message 
        :key="message.id"
        :text="message.message"
        :author="message.fromSelf ? username : user?.username"
      ></Message>
    </div>
    <a-input-group compact>
      <a-input
        placeholder="Write a message"
        v-model:value="text"
        style="width: calc(100% - px)"
      />

      <a-button @click="sendMessage" type="primary">Send</a-button>
    </a-input-group>
  </div>
</template>

<script setup lang="ts">
// import { socket } from "../../../socket";
import { localStorageKeys } from "../../../common/storage-keys";
import Message from "./Message.vue";
import { ref } from "vue";

// import ChatBox from "./ChatBox.vue";
const username = localStorage.getItem(localStorageKeys.USERNAME);
defineProps({
  user: Object,
});

const emit = defineEmits(["input"]);

const text = ref<string>();

const sendMessage = (_event: any) => {
  emit("input", text.value);
  text.value = "";
};
</script>

<style scoped>
</style>
