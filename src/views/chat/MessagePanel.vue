<template>
  <div class="d-flex flex-col">
    <div v-for="message in messages" :class="`d-flex ${message.sender.id === me?.id ? 'justify-right' : '' }`">
      <Message 
        :key="message.id"
        :text="message.message"
        :author="message.sender"
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
import Message from "./components/Message.vue";
import { ref } from "vue";
import { Message as IMessage } from "../../interfaces/chat.interface";
import { User } from "../../interfaces/user.interface";
import { socket } from "../../socket";

const props = defineProps({
  conversationId: {
    type: Number,
    required: true,
  },
  messages: {
    type: Object as () => IMessage[] | undefined,
    required: true,
  },
  me: {
    type: Object as () => User | undefined,
    required: true,
  },
});

const text = ref<string>();

const sendMessage = (_event: any) => {
  socket.emit("message", {
    conversationId: props.conversationId,
    message: text.value,
  })
};

</script>

<style scoped>
</style>
