<script setup lang="ts">
// import ChatBox from './components/ChatBox.vue';
import {  onMounted, ref } from "vue";
import { socket } from "../../socket";
// import MessagePanel from "./MessagePanel.vue";
import { User as IUser } from "../../interfaces/user.interface";
import { Conversation, Message } from "../../interfaces/chat.interface";
import { ChatService } from "../../services/inbox.service";
import User from "./components/User.vue";
import { UserService } from "../../services/user.service";
import router from "../../router";
import { routeNames } from "../../router/route-names";

// const connected = computed(() => state.value.connected);
const me = ref<IUser>();
const conversations = ref<Conversation[]>();

const selectedConversation = ref<{
  id: number | undefined;
  messages: Message[] | undefined;
}>({
  id: undefined,
  messages: undefined,
});

const onSelectConversation = async (conversation: Conversation) => {
  selectedConversation.value.messages = await ChatService.getConversationById(
    conversation.id
  );
  selectedConversation.value.id = conversation.id;
  router.push({
    name: routeNames.INBOX_CONVERSATION,
    params: { conversationId: conversation.id },
  });
};

socket.on("message", (message : Message) => 
{
  console.log("inside message event");
  console.log(message);
  selectedConversation.value.messages?.push(message);
}
);

const getConversations = async () => {
  conversations.value = await ChatService.getMyConversations();
};

const getMyProfile = async () => {
  me.value = await UserService.getMyProfile();
};

onMounted(() => {
  getConversations();
  getMyProfile();
});
</script>

<template>
  <h2>Inbox</h2>
  <div class="d-flex">
    <div class="left-panel">
      <User
        v-for="conversation in conversations"
        :key="conversation.id"
        :user="conversation.participants[0]"
        :selected="selectedConversation.id === conversation.id"
        @select="onSelectConversation(conversation)"
      />
    </div>
    <div class="right-panel">
      <router-view
        :messages="selectedConversation.messages"
        :me="me"
      ></router-view>
      <!-- <MessagePanel :messages="selectedConversation.messages" :me="me" @input="onSend" /> -->
    </div>
  </div>
</template>
<style>
.messages {
  background-color: bisque;
  flex-grow: 1;
  overflow: auto;
  padding: 1rem;
}

.left-panel {
  /* position: fixed; */
  /* left: 0;
  top: 0;
  bottom: 0;
  width: 260px; */
  width: 30%;
  overflow-x: hidden;
  background-color: #3f0e40;
  color: white;
}

.right-panel {
  /* margin-left: 260px; */
  width: 70%;
}
</style>
