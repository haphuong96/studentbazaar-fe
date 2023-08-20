<template>
  <div class="user" @click="onClick" :class="{ selected: selected }">
    <div class="description">
      <div class="name">
        {{ conversation.participants[0].username }}
      </div>
      <div class="last-message">
        {{ conversation.lastMessage?.[0].message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Conversation } from "../../../interfaces/chat.interface";

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
  color: #92959e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
