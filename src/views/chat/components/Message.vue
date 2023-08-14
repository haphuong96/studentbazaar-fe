<template>
  <div :class="['message']">
    <h5>{{ author.username }}</h5>
    {{ text }}
  </div>
</template>
<script setup lang="ts">
import { User } from "../../../interfaces/user.interface";

defineProps({
  author: {
    type: Object as () => User,
    required: true,
  },
  text: {
    type: String,
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
}

.message.dark {
  background: #e9eaf6;
}

h5 {
  margin: 0 0 0.5rem 0;
}
</style>
