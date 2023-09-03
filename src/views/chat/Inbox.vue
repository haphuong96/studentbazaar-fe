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

const me = ref<IUser>();
const conversations = ref<Conversation[]>([]);
const selectedConversationId = ref<string>("");

watch(
  () => route.params,
  async () => {
    if (route.params.conversationId) {
      await setSelectedConversation();
    }
  }
);

const setSelectedConversation = async () => {
  selectedConversationId.value = route.params.conversationId as string;
  console.log("setSelectedConversation ", selectedConversationId.value);
};

const onSelectConversation = async (conversationId: number) => {
  console.log("onSelectConversation ", conversationId);
  selectedConversationId.value = route.params.conversationId as string;
  router.push({
    name: routeNames.INBOX_CONVERSATION,
    params: { conversationId },
  });
};

socket.on("message", (message: Message) => {
  console.log(
    "===========> ",
    selectedConversationId.value,
    message.conversation.id
  );
  // if (+selectedConversationId.value === message?.conversation?.id) {
  //   selectedConversation.value.messages?.push(message);
  // }
  conversations?.value?.forEach((c) => {
    if (c.id === message?.conversation?.id) {
      c.lastMessage = [message];
    }
  });
});

const getConversations = async () => {
  conversations.value = await ChatService.getMyConversations();
};

const getMyProfile = async () => {
  me.value = await UserService.getMyProfile();
};

onMounted(async () => {
  console.log("mounted ", selectedConversationId.value);
  await Promise.all([getConversations(), getMyProfile()]);

  // if no conversation is selected, select the first conversation
  if (conversations.value?.length && !route.params.conversationId) {
    onSelectConversation(conversations.value[0].id);
  } else if (route.params.conversationId) {
    // check if it is a new conversation. If yes, add it to the list
    const conversation: Conversation = await ChatService.getConversationById(
      +route.params.conversationId
    );
    if (conversation?.isNew) {
      conversations.value?.unshift(conversation);
    }
    // await setSelectedConversation();
    await onSelectConversation(+route.params.conversationId);
  }
});
</script>

<template>
  <div class="d-flex inbox">
    <div class="left-panel">
      <h2 class="ml-16 my-16">Chat</h2>
      <div class="inbox__list-user">
        <User
          v-for="conversation in conversations"
          :key="conversation.id"
          :conversation="conversation"
          :selected="+selectedConversationId === conversation.id"
          @select="onSelectConversation(conversation.id)"
        />
      </div>
    </div>
    <div class="right-panel">
      <router-view
        v-model:conversationId="selectedConversationId"
      ></router-view>
    </div>
  </div>
</template>
<style>
.inbox {
  border: 1px solid lightgray;
  height: 100%;
}
.inbox__list-user {
  overflow-y: scroll;
  overflow-x: hidden;
}
.messages {
  background-color: bisque;
  flex-grow: 1;
  overflow: auto;
  padding: 1rem;
}

.left-panel {
  width: 280px;
  /* overflow: hidden; */
  color: white;
  border-right: 1px solid lightgray;
}

.right-panel {
  /* margin-left: 260px; */
  width: calc(100% - 280px);
  height: calc(100vh - 64px - 32px - 57px - 67px - 56px);
}
</style>
