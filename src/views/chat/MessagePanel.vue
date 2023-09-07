<template>
  <div class="message-panel">
    <div
      id="message-container"
      class="message-panel__messages-container"
      v-if="conversation && messages.length"
    >
      <div
        v-for="message in messages"
        :class="`d-flex ${message.sender.id === me?.id ? 'justify-right' : ''}`"
      >
        <Message
          :type="message.messageType"
          :key="message.id"
          :text="message.message"
          :author="message.sender"
          :time="message.createdDatetime"
          :isMine="message.sender.id === me?.id"
        ></Message>
      </div>
    </div>

    <div class="message-panel__current-user-container">
      <div class="current-user-name" v-if="me">
        {{ oppositeUser?.username }}
        <span v-if="oppositeUser?.fullname">({{ oppositeUser.fullname }})</span>
      </div>
      <!-- <InfoCircleFilled
        v-if="me"
        class="user-info-button"
        @click="viewUserProfile"
      ></InfoCircleFilled> -->
    </div>
    <div class="message-panel__chat-input-container">
      <a-input
        placeholder="Enter your message"
        class="message-panel__chat-input-container__input"
        v-model:value="text"
        @pressEnter="sendMessage"
      >
        <template #prefix>
          <!-- for chat image feature -->
          <!-- <InvisibleImagePicker @image-selected="onImageSelected">
            <FileImageFilled class="emoji-button"></FileImageFilled>
          </InvisibleImagePicker> -->
          <a-popover trigger="click" placement="topLeft">
            <template #content>
              <EmojiPicker :native="true" @select="onSelectEmoji" />
            </template>
            <SmileFilled class="emoji-button"></SmileFilled>
          </a-popover>
        </template>
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
import { SendOutlined, SmileFilled } from "@ant-design/icons-vue";
import { h, onMounted, ref, watch } from "vue";
import EmojiPicker from "vue3-emoji-picker";
import "vue3-emoji-picker/css";
import {
  Conversation,
  Message as IMessage,
} from "../../interfaces/chat.interface";
import { User } from "../../interfaces/user.interface";
// import router from "../../router";
// import { routeNames } from "../../router/route-names";
import { socket } from "../../socket";
// import InvisibleImagePicker from "./components/InvisibleImagePicker.vue";
import { ChatService } from "../../services/inbox.service";
import { UserService } from "../../services/user.service";
import Message from "./components/Message.vue";
const props = defineProps({
  conversationId: {
    type: String,
    required: true,
  },
  // me: {
  //   type: Object as () => User | undefined,
  //   required: true,
  // },
});

// const emit = defineEmits(["update:conversationId"]);

const me = ref<User>();
const messages = ref<IMessage[]>([]);
const conversation = ref<Conversation>();
const oppositeUser = ref<User>();

const text = ref<string>("");

onMounted(() => {
  // emit("update:conversationId", props.conversationId);
  getMyProfile();
  getConversationById();
  getConversationMessages();
  setTimeout(() => {
    scrollToBottom();
  }, 200);
});

const getMyProfile = async () => {
  me.value = await UserService.getMyProfile();
};

const sendMessage = (_event: any) => {
  if (!text.value?.trim()?.length) {
    return;
  }

  socket.emit("message", {
    conversationId: props.conversationId,
    message: text.value?.trim(),
  });
  text.value = "";
};

socket.on("message", (message: IMessage) => {
  console.log("===========> ", message.conversation.id);
  if (+props.conversationId === message?.conversation?.id) {
    messages?.value.push(message);
  }
});
// const sendImageMessage = (url: string) => {
//   if (!url) {
//     return;
//   }
//   socket.emit("message", {
//     conversationId: props.conversationId,
//     message: url,
//     messageType: "image",
//   });
//   text.value = "";
// };

watch(
  () => messages?.value.length,
  () => {
    scrollToBottom();
  }
);

watch(
  () => props.conversationId,
  () => {
    // emit("update:conversationId", props.conversationId);
    getConversationById();
    getConversationMessages();
  }
);

const scrollToBottom = () => {
  const messageContainer = document.getElementById("message-container");
  if (!messageContainer) return;
  setTimeout(() => {
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }, 100);
};

// const viewUserProfile = () => {
//   if (!props.me) return;
//   router.push({
//     name: routeNames.USER_PROFILE,
//     params: { userId: props.me.id },
//   });
// };

const onSelectEmoji = (emoji: any) => {
  text.value += emoji.i;
};

// const onImageSelected = async (image: any) => {
//   const formData = new FormData();
//   formData.append("files", image.origin);
//   try {
//     const imageResults = await ItemService.uploadItemImages(formData);
//     const rs = imageResults[0];
//     if (!rs) return;
//     await sendImageMessage(rs.image.imgPath);
//   } catch (error) {
//     console.log(error);
//   }
// };

const getConversationById = async () => {
  console.log("id ", props.conversationId);
  conversation.value = await ChatService.getConversationById(
    +props.conversationId
  );
  oppositeUser.value = conversation.value.participants.find(
    (user: User) => user.id !== me.value?.id
  );
  return conversation;
};

const getConversationMessages = async () => {
  messages.value = await ChatService.getConversationMessagesById(
    +props.conversationId
  );
  return messages;
};
</script>

<style lang="css" scoped>
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
  padding: 80px 32px 16px 32px;
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
  padding: 8px 16px 8px 16px;
}

.message-panel__chat-input-container__btn {
  height: 40px;
  width: 40px;
  margin-left: 32px;
}

.emoji-button {
  font-size: 20px;
  color: #1890ff;
  cursor: pointer;
  margin-right: 16px;
}
.message-panel__current-user-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 64px;
  border-bottom: 1px solid lightgray;
  background-color: white;
  padding: 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.message-panel__current-user-container > .current-user-name {
  font-size: 16px;
  font-weight: 600;
}

.message-panel__current-user-container > .user-info-button {
  font-size: 20px;
  color: #1890ff;
  cursor: pointer;
}
</style>
