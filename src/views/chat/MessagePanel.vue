<template>
  <div class="message-panel">
    <div id="message-container" class="message-panel__messages-container">
      <div
        v-for="message in messages"
        :class="`d-flex ${message.sender.id === me?.id ? 'justify-right' : ''}`"
      >
        <Message
          :key="message.id"
          :text="message.message"
          :author="message.sender"
          :time="message.createdDatetime"
          :isMine="message.sender.id === me?.id"
        ></Message>
      </div>
    </div>

    <div class="message-panel__chat-input-container">
      <a-input
        placeholder="Enter you message"
        class="message-panel__chat-input-container__input"
        v-model:value="text"
        @pressEnter="sendMessage"
      >
        <template #suffix>
          <a-button
            type="primary"
            :icon="h(SendOutlined)"
            @click="sendMessage"
            shape="circle"
            class="message-panel__chat-input-container__btn"
          ></a-button>
        </template>
      </a-input>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { socket } from "../../../socket";
import Message from "./components/Message.vue";
import { ref, h, watch, onMounted } from "vue";
import { Message as IMessage } from "../../interfaces/chat.interface";
import { User } from "../../interfaces/user.interface";
import { socket } from "../../socket";
import { SendOutlined } from "@ant-design/icons-vue";

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

onMounted(() => {
  setTimeout(() => {
    scrollToBottom();
  }, 200);
});

const sendMessage = (_event: any) => {
  socket.emit("message", {
    conversationId: props.conversationId,
    message: text.value,
  });
  text.value = "";
};

watch(
  () => props.messages?.length,
  () => {
    scrollToBottom();
  }
);

const scrollToBottom = () => {
  const messageContainer = document.getElementById("message-container");
  if (!messageContainer) return;
  setTimeout(() => {
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }, 100);
};
</script>

<style scoped>
.message-panel {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.message-panel__messages-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 48px;
  padding: 16px 32px 80px 32px;
  overflow: scroll;
}

.message-panel__chat-input-container {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 64px;
  border-top: 1px solid lightgray;
  background-color: white;
  padding: 0 0;
}

.message-panel__chat-input-container__input {
  height: 64px;
  padding: 8px 16px 8px 32px;
}

.message-panel__chat-input-container__btn {
  height: 40px;
  width: 40px;
  margin-left: 32px;
}
</style>
