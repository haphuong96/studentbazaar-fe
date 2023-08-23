<template>
  <a-row v-if="!isPageLoading && itemDetails">
    <a-col :span="12">
      <a-breadcrumb>
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
      <div class="my-16">
        <GalleryView :sources="itemDetails.img" />
      </div>
    </a-col>
    <a-col :span="12">
      <div class="d-flex align-center">
        <div class="d-flex align-center flex-grow-1">
          <h2>{{ itemDetails.itemName }}</h2>
          <div class="px-32">
            {{ itemDetails.itemPrice ? `£${itemDetails.itemPrice}` : "FREE" }}
          </div>
        </div>
        <a-select
          ref="select"
          v-model:value="itemStatus"
          style="width: 120px"
          :options="itemStatuses"
          @change="onStatusChange"
          v-if="isOwner"
        ></a-select>
      </div>
      <div class="py-16">
        <UserInfo :user="itemDetails.owner" />
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
      <div class="my-32" v-if="!isOwner">
        <span> <a-button @click="() => {}">Ask seller</a-button></span>
        <span class="ml-32">
          <a-button @click="toggleFavorite"
            ><span v-if="!itemDetails.isFavorite">Add to Favorites</span>
            <span v-else
              ><heart-filled :style="{ color: 'red' }" /> Remove from
              Favorites</span
            >
          </a-button></span
        >
      </div>
      <div class="my-32" v-else>
        <span> <a-button type="primary" ghost>Edit</a-button></span>
        <span class="ml-16">
          <a-button type="primary" danger @click="deleteItem"
            >Delete</a-button
          ></span
        >
      </div>
    </a-col>
  </a-row>
  <a-modal
    v-model:visible="messageModal.sendMessageModalVisible"
    :title="`Send a message to ${itemDetails?.owner?.username}`"
    :maskClosable="false"
  >
    <template #footer>
      <a-button>Cancel</a-button>
      <a-button @click="sendMessageToSeller">Send</a-button>
    </template>
    <a-textarea
      v-model:value="messageModal.messageToSeller"
      placeholder="Type your message to seller here..."
    />
  </a-modal>
</template>

<script setup lang="ts">
import { ComputedRef, computed, createVNode, onMounted, ref } from "vue";
import { Item, ItemCategory } from "../../interfaces/item.interface";
import { ItemService } from "../../services/item.service";
import { Route, getCategoryPath } from "../../utils/get-category-path.util";
// import { routeNames } from "../../router/route-names";
import { formatFromNow } from "../../utils/datetime.util";

import {
  EnvironmentFilled,
  HeartFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";
import { SelectProps, message } from "ant-design-vue";
import GalleryView from "../../components/GalleryView.vue";
import { ItemStatus } from "../../interfaces/item.interface";
import { User } from "../../interfaces/user.interface";
import router from "../../router";
import { UserService } from "../../services/user.service";
import UserInfo from "./components/UserInfo.vue";
import { Modal } from "ant-design-vue";

const props = defineProps({
  itemId: Number,
});
const itemStatuses = ref<SelectProps["options"]>([
  {
    value: ItemStatus.DRAFT,
    label: "Draft",
  },
  {
    value: ItemStatus.PUBLISHED,
    label: "Published",
  },
  {
    value: ItemStatus.SOLD,
    label: "Sold",
  },
]);

const itemDetails = ref<Item>();
const itemCategoryBreadCrumb = ref<ItemCategory>();

const getItemDetails = async () => {
  try {
    itemDetails.value = await ItemService.getItemDetails(props.itemId);
    itemCategoryBreadCrumb.value = await ItemService.getOneItemCategory({
      id: itemDetails.value.category,
    });

    itemStatus.value = itemDetails.value.status;
  } catch (err) {
    console.log(err);
  }
};

const itemStatus = ref<ItemStatus>();
const onStatusChange = async (status: ItemStatus) => {
  try {
    itemDetails.value = await ItemService.updateItem(props.itemId, {
      status: status,
    });
  } catch (err) {
    console.log(err);
  }
};

const myProfile = ref<User>();
const getMyProfile = async () => {
  try {
    myProfile.value = await UserService.getMyProfile();
  } catch (err) {
    console.log(err);
  }
};

const isOwner = computed(() => {
  return myProfile.value?.id === itemDetails.value?.owner.id;
});

const routes: ComputedRef<Route[]> = computed(() => {
  return getCategoryPath(itemCategoryBreadCrumb.value);
});

const isPageLoading = ref<boolean>(true);
onMounted(async () => {
  await Promise.all([getItemDetails(), getMyProfile()]);
  isPageLoading.value = false;
});

const messageModal = ref({
  sendMessageModalVisible: false,
  messageToSeller: "",
});

const sendMessageToSeller = async () => {};

const toggleFavorite = async () => {
  if (props.itemId) {
    itemDetails.value = await ItemService.toggleFavorite(props.itemId);
  }
};

const deleteItem = async () => {
  Modal.confirm({
    title: "Delete Item",
    icon: createVNode(ExclamationCircleOutlined),
    content: "Are you sure delete this item?",
    okText: "Yes",
    okType: "danger",
    cancelText: "No",
    onOk() {
      onDeleteItem();
    },
    onCancel() {
      // console.log("Cancel");
    },
  });
};

const onDeleteItem = async () => {
  if (props.itemId) {
    try {
      await ItemService.deleteItem(props.itemId);
      message.success("Delete item successfully!");
      router.go(-1);
    } catch (error) {
      message.success("Delete item failed!");
    }
  }
};
</script>
<style></style>
