<template>
  <a-row>
    <a-col :span="20">
      <div class="d-flex align-center" v-if="userProfile">
        <!-- <img class="user-profile__avatar" /> -->
        <a-avatar :size="{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }">
          <template #icon><UserOutlined /></template
        ></a-avatar>
        <div class="user-profile__info">
          <span class="user-profile__name">{{ userProfile.username }}</span>
          <span class="user-profile__address">
            {{ userProfile.university.universityName }}</span
          >
          <span class="my-8"
            ><environment-filled></environment-filled>
            {{ userProfile.campus.campusName }}</span
          >
        </div>
      </div>
    </a-col>
    <!-- <a-col :span="4">
      <div class="d-flex">
        <a-button :icon="h(EllipsisOutlined)"></a-button>
      </div>
    </a-col> -->
  </a-row>
  <a-row class="py-16">
    <a-col :span="24">
      <a-button :icon="h(MailOutlined)" @click="startConversation"
        >Send a message</a-button
      >
    </a-col>
  </a-row>
  <a-row>
    <a-col :span="24">
      <p>{{ userProfile?.aboutMe }}</p>
    </a-col>
  </a-row>
  <a-row class="py-16">
    <a-col :span="24" class="user-profile__address">Listed recently</a-col>
    <a-col :span="24">
      <div class="d-flex user-profile__items">
        <div class="user-profile__item" v-for="item in userItems?.items">
          <ItemPost :item="item" :showOwner="false"></ItemPost>
        </div>
      </div>
    </a-col>
  </a-row>
</template>
<script setup lang="ts">
import { EnvironmentFilled, MailOutlined } from "@ant-design/icons-vue";
import { h, onMounted, ref } from "vue";
import { Conversation } from "../../interfaces/chat.interface";
import { GetItemsCursorBased } from "../../interfaces/item.interface";
import { User } from "../../interfaces/user.interface";
import router from "../../router";
import { routeNames } from "../../router/route-names";
import { ChatService } from "../../services/inbox.service";
import { ItemService } from "../../services/item.service";
import { UserService } from "../../services/user.service";
import ItemPost from "../item/components/ItemPost.vue";
import { UserOutlined } from "@ant-design/icons-vue";

const props = defineProps({
  userId: Number,
});

const userProfile = ref<User | undefined>();
const userItems = ref<GetItemsCursorBased>();

const getUserProfile = async () => {
  userProfile.value = await UserService.getUserProfile(props.userId);
};

const getItemsByUser = async () => {
  userItems.value = (await ItemService.getItems({
    ownerId: props.userId,
  })) as GetItemsCursorBased;
  console.log("items ", userItems.value);
};

onMounted(() => {
  getUserProfile();
  getItemsByUser();
});

const startConversation = async () => {
  if (props.userId) {
    const conversation: Conversation =
      await ChatService.getConversationByTargetUser(props.userId);

    router.push({
      name: routeNames.INBOX_CONVERSATION,
      params: {
        conversationId: conversation.id,
      },
    });
  }
};
</script>
<style>
.user-profile__avatar {
  width: 80px;
  height: 80px;
  background-color: lightgray;
  border-radius: 40px;
  margin-right: 32px;
}

.user-profile__info {
  margin-left: 32px;
  display: grid;
}

.user-profile__name {
  font-size: 24px;
  font-weight: 700;
  color: black;
}

.user-profile__address {
  font-size: 16px;
  font-weight: 500;
  color: black;
}

.user-profile__items {
  overflow: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.user-profile__items::-webkit-scrollbar {
  display: none;
}

.user-profile__item {
  margin: 0 32px;
}
</style>
