<script setup lang="ts">
import { onMounted, ref } from "vue";
import {ItemService} from "../../services/item.service";

const itemList = ref();

onMounted(() => {
    getItems();
})
const getItems = async () => {
    try {
        const data = await ItemService.getItems();
        itemList.value = data;
        console.log('itemList',itemList.value)
    } catch(err) {
        console.log(err)
    }
}
</script>
<template>
  <h2>Listed recently</h2>
  <div v-for="item in itemList" v-if="itemList">
    {{ item.itemName }}
    
  </div>
  <a-row :gutter="[16, 16]">
    <a-col :span="6" >test1test1test1test1test1test1test1test1test1test1</a-col>
    <a-col :span="6" >test2</a-col>
    <a-col :span="6" >test3</a-col>
    <a-col :span="6" >test4</a-col>
  </a-row>
</template>

<!-- class="logo" -->
