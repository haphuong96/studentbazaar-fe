<template>
  <a-layout class="layout">
    <!-- <div :style="{ position: 'fixed', zIndex: 1, width: '100%'}"> -->
    <a-layout-header class="nav-bar-header">
      <div class="d-flex">
        <a @click="() => router.push({ name: routeNames.MARKETPLACE_HOME })">
          <img src="@/assets/logo.png" alt="logo" class="logo" />
        </a>
        <div class="d-flex flex-grow-1 align-center">
          <a-input-search
            v-model:value="value"
            placeholder="Search for items"
            size="large"
            @search="onSearch"
          >
            <template #enterButton>
              <a-button>Search</a-button>
            </template>
          </a-input-search>
        </div>
        <div class="d-flex header-menu">
          <a><bell-two-tone /></a>
          <a><message-two-tone /></a>
          <a @click="() => $router.push({ name: routeNames.LIST_ITEM })"
            ><tags-two-tone />
          </a>
          <a>
            <!-- #f56a00 -->
            <a-dropdown placement="bottomRight">
              <a-avatar style="color: #f56a00; background-color: #fde3cf">{{
                userFullname?.charAt(0).toUpperCase()
              }}</a-avatar>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="AuthService.logOut">
                    Logout
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown></a
          >
        </div>
      </div>
    </a-layout-header>
    <!-- <a-layout-header class="nav-bar-header"> -->
    <a-menu
      v-model:selectedKeys="categorySelected"
      mode="horizontal"
      theme="dark"
      :style="{ lineHeight: '30px' }"
      class="px-50"
      @click="goToBrowseByCategory"
    >
      <div v-for="category in itemCategories" :key="category.id">
        <a-menu-item :key="category.id">{{
          category.categoryName
        }}</a-menu-item>
      </div>
    </a-menu>
    <!-- </a-layout-header> -->
    <!-- </div> -->
    <a-layout-content style="padding: 0 50px">
      <div
        class="navbar__back my-16"
        v-if="canBack"
        @click="() => router.go(-1)"
      >
        <left-outlined /> Back
      </div>
      <h3 class="my-16">{{ pageTitle }}</h3>
      <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
        <router-view/>
      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Student Bazaar ©2023 Created by Phuong Nguyen
    </a-layout-footer>
  </a-layout>
</template>

<script lang="ts" setup>
import { computed, ComputedRef, ref, Ref, onMounted } from "vue";
import {
  BellTwoTone,
  LeftOutlined,
  MessageTwoTone,
  TagsTwoTone,
} from "@ant-design/icons-vue";
import { routeNames } from "../router/route-names";
import router from "../router";
import { useRoute } from "vue-router";
import { localStorageKeys } from "../common/storage-keys";
import { AuthService } from "../services/auth.service";
import { ItemCategory } from "../interfaces/item.interface";
import { ItemService } from "../services/item.service";
import { MenuProps } from "ant-design-vue";

const route = useRoute();
const pageTitle: ComputedRef<string | undefined> | any = computed(() => {
  return route.meta.pageTitle || "";
});
const canBack: ComputedRef<boolean> | any = computed(() => {
  return route.meta.canBack || false;
});

const userFullname = computed(() => {
  return (
    localStorage.getItem(localStorageKeys.USER_FULLNAME) ||
    localStorage.getItem(localStorageKeys.USERNAME)
  );
});

const itemCategories: Ref<ItemCategory[] | undefined> = ref<
  ItemCategory[] | undefined
>();
const getItemCategories = async () => {
  const data: ItemCategory[] = await ItemService.getItemCategories();
  itemCategories.value = data;
};

onMounted(() => {
  getItemCategories();
});

const categorySelected = ref<string[]>(["1"]);
const goToBrowseByCategory: MenuProps["onClick"] = (menuInfo) =>
  router.push({
    name: routeNames.MARKETPLACE_BY_CATEGORY,
    params: { categoryId: [menuInfo.key] },
  });

</script>
<style scoped>
.header-menu > a {
  margin-left: 15px;
  font-size: 20px;
  color: #f56a00;
}

.logo {
  color: #fff;
  /* font-size: 20px; */
  margin-right: 20px;
  max-width: 70px;
}

.navbar__back {
  cursor: pointer;
  width: fit-content;
}

.nav-bar-header {
  background-color: #fff;
}
</style>
