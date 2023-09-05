<template>
  <div class="user" @click="onClick" :class="{ selected: selected }">
    <div class="description">
      <div class="name">
        {{ conversation.participants[0].username }}
      </div>
      <!-- <div class="d-flex"> -->
      <div class="last-message">
        {{ conversation.lastMessage?.[0].message }} ·
        <span v-if="conversation?.lastMessage?.length">{{
          formatFromNow(conversation.lastMessage?.[0].createdDatetime as string)
        }}</span>
      </div>
      <!-- <div class="ml-16">{{ formatFromNow(conversation.lastMessage?.[0].createdDatetime as string) }}</div> -->
      <!-- </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { Conversation } from "../../../interfaces/chat.interface";
import { formatFromNow } from "../../../utils/datetime.util";

defineProps({
  conversation: {
    type: Object as () => Conversation,
    required: true,
  },
  selected: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["select"]);

const onClick = () => {
  emit("select");
};
</script>

<style scoped>
.selected {
  background-color: #e5efff;
}

.user {
  padding: 10px;
  height: 64px;
}

.description {
  display: inline-block;
  color: black;
}

.name {
  color: black;
  font-weight: 600;
}

.last-message {
  /* display: flex;
  flex-grow: 1; */
  color: #92959e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  /* width: 100px; */
}

.selected > .name {
  color: white;
}

.selected > .last-message {
  color: #92959e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
