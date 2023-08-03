<template>
  <div id="infinity-scroll-container" class="infinity-scroll-container">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
const emit = defineEmits(["onLoadMore"]);
onMounted(() => {
  const scrollableDiv = document.getElementById("infinity-scroll-container");
  scrollableDiv?.addEventListener("scroll", handleScroll);
});
const handleScroll = ($event: any) => {
  const containerHeight = $event.target.offsetHeight;
  const scrollHeight = $event.target.scrollHeight;
  if (scrollHeight <= containerHeight + 50) return;
  const scrollBottom = $event.target.scrollTop + $event.target.offsetHeight;
  if (scrollHeight - scrollBottom <= 50) {
    emit("onLoadMore");
  }
};
</script>
<style lang="css" scoped>
.infinity-scroll-container {
  overflow: scroll;
  width: auto;
  height: auto;
}
</style>
