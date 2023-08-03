<template>
  <InfinityScroll
    @on-load-more="onLoadMore"
    class="infinity-scroll-container-xx"
  >
    <div v-for="number in itemCount" :key="number" class="test-element">
      {{ number }}
    </div>
  </InfinityScroll>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import InfinityScroll from "../../components/InfinityScroll.vue";
const itemCount = ref<number>(2);
const onLoadMore = () => {
  // this is load more event. call load more data here. when fetching, return to did not call fetch function too many times
  itemCount.value = itemCount.value + 1;
  console.log("onLoadMore", itemCount.value);
};
</script>
<style scoped>
.infinity-scroll-container {
  height: 700px;
  width: 100%;
}
.test-element {
  height: 500px;
  width: 500px;
  background-color: red;
  margin: 32px;
}
</style>
