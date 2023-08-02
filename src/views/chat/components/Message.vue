<template>
  <div :class="['message', { dark }]">
    <h5>{{ author }}</h5>
    {{ text }}
  </div>
</template>
<script setup lang="ts">
defineProps(['author', 'text', 'dark']);

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
  margin: 0 0 .5rem 0;
}
</style>
