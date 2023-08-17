<template>
  <div class="user" @click="onClick" :class="{ selected: selected }">
    <div class="description">
      <div class="name">
        {{ conversation.participants[0].username }}
      </div>
      <div class="status">
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
  background-color: #1164a3;
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
  color: #92959e;
}

.status {
  color: black;
}

.selected > .name {
  color: white;
}

.selected > .status {
  color: #92959e;
}
</style>
