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

      <!-- <div class="d-flex">
        <div class="d-flex flex-col" v-for="img in itemDetails.img">
          <a-image :src="img.imgPath" :width="100"></a-image>
        </div>

        <div>
          <a-image :src="itemDetails.img[0].imgPath" :width="400">
          </a-image>
        </div>
      </div> -->
      <GalleryView :sources="itemDetails.img" />
    </a-col>
    <a-col :span="12">
      <div class="d-flex align-center">
        <h2>{{ itemDetails.itemName }}</h2>
        <div class="pl-32">
          {{ itemDetails.itemPrice ? `£${itemDetails.itemPrice}` : "FREE" }}
        </div>
      </div>
      <div
        class="d-flex py-16 link"
        @click="
          () =>
            router.push({
              name: routeNames.USER_PROFILE,
              params: { userId: itemDetails?.owner.id },
            })
        "
      >
        <a-avatar></a-avatar>
        <div class="pl-16">
          <div>
            {{ itemDetails.owner.username }}
          </div>
          <div>
            {{ itemDetails.owner.university.universityName }}
          </div>
        </div>
      </div>
      <div>{{ itemDetails.itemDescription }}</div>
      <a-divider />
      <a-descriptions :labelStyle="{ 'font-weight': 'bold' }" :column="1">
        <a-descriptions-item label="Condition">{{
          itemDetails.condition.conditionName
        }}</a-descriptions-item>
        <a-descriptions-item label="Uploaded">{{
          formatFromNow(itemDetails.createdDatetime)
        }}</a-descriptions-item>
        <a-descriptions-item label="Pick Up Location">
          <div class="d-flex justify-space-between">
            <div class="mr-16"><environment-filled /></div>

            <div class="d-flex flex-col">
              <div>{{ itemDetails.location.name }}</div>
              <div>{{ itemDetails.location.address }}</div>
            </div>
          </div>
        </a-descriptions-item>
      </a-descriptions>
      <div class="my-32">
        <span class="ml-32"> <a-button>Ask seller</a-button></span>
        <span> <a-button>Add to Favorites</a-button></span>
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { ComputedRef, computed, onMounted, ref } from "vue";
import { ItemService } from "../../services/item.service";
import { Item } from "../../interfaces/item.interface";
import { Route, getCategoryPath } from "../../utils/get-category-path.util";
// import { routeNames } from "../../router/route-names";
import { formatFromNow } from "../../utils/datetime.util";

import router from "../../router";
import GalleryView from "../../components/GalleryView.vue";
import { routeNames } from "../../router/route-names";
import { EnvironmentFilled } from "@ant-design/icons-vue";
const props = defineProps({
  itemId: Number,
});

const itemDetails = ref<Item>();
const getItemDetails = async () => {
  try {
    itemDetails.value = await ItemService.getItemDetails(props.itemId);
    console.log(itemDetails.value);
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
