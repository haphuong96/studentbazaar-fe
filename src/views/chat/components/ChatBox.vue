<template>
  <a-input-group compact>
    <a-input placeholder="Write a message" v-model:value="text" style="width: calc(100% - px)" />
    
    <a-button @click="sendMessage" type="primary">Send</a-button>
  </a-input-group>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { socket } from '../../../socket';

const text = ref<string>();

const sendMessage = (_event: any) => {
  console.log('text ' + text.value)
  socket.emit('message', {
    'message': text.value
  })
}
</script>
<style>

</style>
