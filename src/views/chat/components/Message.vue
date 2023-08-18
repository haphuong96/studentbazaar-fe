<template>
  <div :class="[!isMine ? 'message' : 'mine-message']">
    <!-- <div class="message-auth-name">{{ author.username }}</div> -->
    <div>{{ text }}</div>
    <!-- <div>{{ formatFromNow(time) }}</div> -->
  </div>
</template>
<script setup lang="ts">
import { User } from "../../../interfaces/user.interface";
// import { formatFromNow } from "../../../utils/datetime.util";

defineProps({
  author: {
    type: Object as () => User,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  isMine: {
    type: Boolean,
    required: true,
  },
});

</script>
<style>
.message {
  background: #e7e7e7;
  border-radius: 10px;
  padding: 1rem;
  width: fit-content;
  margin-top: 8px;
}

.mine-message {
  background: #1164a3;
  color: white;
  border-radius: 10px;
  padding: 1rem;
  width: fit-content;
  margin-top: 8px;
}

.message-auth-name {
  font-size: 16px;
  font-weight: 600;
}

.message.dark {
  background: #e9eaf6;
}

h5 {
  margin: 0 0 0.5rem 0;
}
</style>
