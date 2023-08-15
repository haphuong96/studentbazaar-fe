<script setup lang="ts">
// import ChatBox from './components/ChatBox.vue';
import { onMounted, ref, watch } from "vue";
import { socket } from "../../socket";
// import MessagePanel from "./MessagePanel.vue";
import { User as IUser } from "../../interfaces/user.interface";
import { Conversation, Message } from "../../interfaces/chat.interface";
import { ChatService } from "../../services/inbox.service";
import User from "./components/User.vue";
import { UserService } from "../../services/user.service";
import router from "../../router";
import { routeNames } from "../../router/route-names";
import { RouteLocationNormalizedLoaded } from "vue-router";
import { useRoute } from "vue-router";

const route: RouteLocationNormalizedLoaded = useRoute();

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

watch(
  () => route.params.conversationId,
  async () => {
    if (route.params.conversationId) {
      await setSelectedConversation();
    }
  }
);

const setSelectedConversation = async () => {
  console.log("zo day");
  selectedConversation.value.id = +route.params.conversationId;
  selectedConversation.value.messages =
    await ChatService.getConversationMessagesById(
      selectedConversation.value.id
    );
};

const onSelectConversation = async (conversationId: number) => {
  // selectedConversation.value.messages = await ChatService.getConversationMessagesById(
  //   conversation.id
  // );
  // selectedConversation.value.id = conversation.id;
  router.push({
    name: routeNames.INBOX_CONVERSATION,
    params: { conversationId },
  });
};

socket.on("message", (message: Message) => {
  console.log("inside message event");
  console.log(message);
  selectedConversation.value.messages?.push(message);
});

const getConversations = async () => {
  conversations.value = await ChatService.getMyConversations();
};

const getMyProfile = async () => {
  me.value = await UserService.getMyProfile();
};

onMounted(async () => {
  console.log("mounted ", selectedConversation.value.id);
  await Promise.all([getConversations(), getMyProfile()]);

  // if no conversation is selected, select the first conversation
  if (conversations.value?.length && !route.params.conversationId) {
    console.log('no conversation')
    onSelectConversation(conversations.value[0].id);
  } else if (route.params.conversationId) {
    // check if it is a new conversation. If yes, add it to the list
    const conversation: Conversation = await ChatService.getConversationById(
      +route.params.conversationId
    );
    if (conversation?.isNew) {
      conversations.value?.unshift(conversation);
    }
    await setSelectedConversation();
  }
});
</script>

<template>
  <h2>Inbox</h2>
  <div class="d-flex">
    <div class="left-panel">
      <User
        v-for="conversation in conversations"
        :key="conversation.id"
        :conversation="conversation"
        :selected="selectedConversation.id === conversation.id"
        @select="onSelectConversation(conversation.id)"
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
