<script setup lang="ts">
import ChatBox from './components/ChatBox.vue';
import { computed } from 'vue';
import { state } from '../../socket';

const connected = computed(() => state.value.connected)
</script>

<template>
  <h2>Inbox</h2>
  <h4>{{ connected }}</h4>
  <div class="messages">
    
  </div>
  <ChatBox/>
</template>
<style>
.messages {
  background-color: bisque;
  flex-grow: 1;
  overflow: auto;
  padding: 1rem;
}

</style>
