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

const onSelectConversation = async (conversation: Conversation) => {
  console.log("onSelectConversation ", conversation);
  console.log("conversation ", conversation);
  selectedConversationId.value = route.params.conversationId as string;

  // mark the conversation as read
  socket.emit("read_message", {
    messageId: conversation.lastMessage?.[0]?.id,
  });
  conversation.isRead = true;

  router.push({
    name: routeNames.INBOX_CONVERSATION,
    params: { conversationId: conversation.id },
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

  for (let i = 0; i < conversations.value?.length; i++) {
    if (conversations.value[i].id === message?.conversation?.id) {
      // update last message and mark unread if conversation is selected
      conversations.value[i].lastMessage = [message];
      conversations.value[i].isRead =
        message.conversation.id === +selectedConversationId.value
          ? true
          : false;

      // bring conversation on top
      const conversationShift: Conversation = conversations.value?.splice(
        i,
        1
      )[0];
      conversations.value?.unshift(conversationShift);
    }
  }
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
    onSelectConversation(conversations.value[0]);
  } else if (route.params.conversationId) {
    // check if it is a new conversation. If yes, add it to the list
    const conversation: Conversation = await ChatService.getConversationById(
      +route.params.conversationId
    );
    if (conversation?.isNew) {
      conversations.value?.unshift(conversation);
    }
    // await setSelectedConversation();
    await onSelectConversation(conversation);
  }
});
</script>

<template>
  <div class="d-flex inbox">
    <div class="left-panel">
      <h2 class="ml-16 my-16">Chat</h2>
      <div class="inbox__list-user" v-if="me">
        <User
          v-for="conversation in conversations"
          :key="conversation.id"
          :conversation="conversation"
          :selected="+selectedConversationId === conversation.id"
          :meId="me.id"
          @select="onSelectConversation(conversation)"
        />
      </div>
    </div>
    <div class="right-panel" v-if="selectedConversationId">
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
