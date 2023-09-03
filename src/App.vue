<script setup lang="ts">
import { ComputedRef, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { socket } from "./socket";
import { localStorageKeys } from "./common/storage-keys";

// https://router.vuejs.org/guide/advanced/composition-api.html#accessing-the-router-and-current-route-inside-setup
// set appropriate layout based on route meta
const route = useRoute();
const layout: ComputedRef<string | undefined> | any = computed(() => {
  return route.meta.layout || undefined;
});

onMounted(() => {
  if (localStorage.getItem(localStorageKeys.ACCESS_TOKEN)) {
    socket.connect();
  }
});
</script>

<template>
  <div>
    <Suspense>
      <component :is="layout"> </component>
    </Suspense>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
