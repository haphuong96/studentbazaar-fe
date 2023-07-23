<template>
  <a-row v-if="itemDetails">
    <a-col :span="12">
      <a-breadcrumb v-if="itemDetails">
        <span v-for="route in routes">
          <span v-if="routes.indexOf(route) === routes.length - 1">
            <a-breadcrumb-item>{{
              route.breadcrumbName
            }}</a-breadcrumb-item></span
          >
          <span v-else class="link" @click="router.push(route.path)"
            ><a-breadcrumb-item>{{
              route.breadcrumbName
            }}</a-breadcrumb-item></span
          >
        </span>
      </a-breadcrumb>
    </a-col>
    <a-col :span="12">
      <div class="d-flex align-center">
        <h2>{{ itemDetails.itemName }}</h2>
        <div class="pl-32">
          {{ itemDetails.itemPrice ? `£${itemDetails.itemPrice}` : "FREE" }}
        </div>
      </div>
      <div class="d-flex py-16">
        <a-avatar></a-avatar>
        <div class="pl-16">
          <div>
            {{ itemDetails.owner.username }}
          </div>
          <div>
            {{ itemDetails.owner.university.universityName }}
          </div>
          <div>
            {{ itemDetails.owner.campus }}
          </div>
        </div>
      </div>
      <div>{{ itemDetails.itemDescription }}</div>
      <a-divider />
      <a-descriptions :labelStyle="{ 'font-weight': 'bold' }" :column="1">
        <a-descriptions-item label="Condition">{{
          itemDetails.condition.conditionName
        }}</a-descriptions-item>
        <a-descriptions-item label="Uploaded">{{ formatFromNow(itemDetails.createdDatetime) }}</a-descriptions-item>
      </a-descriptions>
      
      <a-button>Ask seller</a-button>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { ComputedRef, computed, onMounted, ref } from "vue";
import { ItemService } from "../../services/item.service";
import { Item } from "../../interfaces/item.interface";
import { Route, getCategoryPath } from "../../utils/get-category-path.util";
import { routeNames } from "../../router/route-names";
import { formatFromNow } from "../../utils/datetime.util";

import router from "../../router";

const props = defineProps({
  itemId: Number,
});

const itemDetails = ref<Item>();
const getItemDetails = async () => {
  try {
    itemDetails.value = await ItemService.getItemDetails(props.itemId);
  } catch (err) {
    console.log(err);
  }
};

const routes: ComputedRef<Route[]> = computed(() => {
  return getCategoryPath(itemDetails.value?.category);
});

onMounted(() => {
  getItemDetails();
});
</script>
<style></style>
