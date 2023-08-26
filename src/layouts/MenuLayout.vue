<template>
  <a-layout class="layout menu-layout-container">
    <!-- <div :style="{ position: 'fixed', zIndex: 1, width: '100%'}"> -->
    <a-layout-header class="nav-bar-header">
      <div class="d-flex">
        <a @click="() => router.push({ name: routeNames.MARKETPLACE_HOME })">
          <img src="@/assets/logo.png" alt="logo" class="logo" />
        </a>
        <div class="d-flex flex-grow-1 align-center">
          <a-input-search
            v-model:value="searchKeyword"
            :placeholder="
              searchInCategory
                ? `Search in ${searchInCategory.categoryName}`
                : 'Search for items'
            "
            size="large"
            @search="onSearch"
          >
            <template #prefix>
              <search-outlined />
            </template>
            <template #enterButton>
              <a-button>Search</a-button>
            </template>
          </a-input-search>
        </div>
        <div class="d-flex header-menu">
          <a><bell-outlined /></a>
          <router-link :to="{ name: routeNames.INBOX }"
            ><message-outlined
          /></router-link>
          <!-- <a @click="() => $router.push({ name: routeNames.LIST_ITEM })"
            ><tags-two-tone />
          </a> -->
          <router-link :to="{ name: routeNames.MY_FAVORITES }"
            ><heart-outlined
          /></router-link>
          <a>
            <!-- #f56a00 -->
            <a-dropdown placement="bottomRight">
              <!-- #f56a00 -->
              <router-link :to="{ name: routeNames.MY_PROFILE }">
                <a-avatar style="color: #D6763C; background-color: #fde3cf">{{
                  userFullname?.charAt(0).toUpperCase()
                }}</a-avatar></router-link
              >
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="AuthService.logOut">
                    Logout
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown></a
          >
          <router-link :to="{ name: routeNames.LIST_ITEM }">
            <a-button
              ><plus-outlined></plus-outlined> Sell Item</a-button
            ></router-link
          >
        </div>
      </div>
    </a-layout-header>
    <div class="item-category">
      <ul>
        <li v-for="category in itemCategories" :key="category.path">
          <router-link
            :to="{
              name: routeNames.MARKETPLACE_BY_CATEGORY,
              params: { categoryPath: category.path },
            }"
            >{{ category.categoryName }}</router-link
          >
        </li>
      </ul>
    </div>
    <a-layout-content class="menu-layout__a-layout-content">
      <div>
        <div
          class="navbar__back my-16"
          v-if="canBack"
          @click="() => router.go(-1)"
        >
          <left-outlined /> Back
        </div>
        <h3 class="my-16">{{ pageTitle }}</h3>
        <div class="menu-layout__router-container">
          <router-view @browse-category="defineSearchScope" />
        </div>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts" setup>
import { computed, ComputedRef, ref, Ref, onMounted, watch } from "vue";
import {
  BellOutlined,
  MessageOutlined,
  HeartOutlined,
  // BellTwoTone,
  LeftOutlined,
  // MessageTwoTone,
  // TagsTwoTone,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons-vue";
import { routeNames } from "../router/route-names";
import router from "../router";
import { useRoute } from "vue-router";
import { localStorageKeys } from "../common/storage-keys";
import { AuthService } from "../services/auth.service";
import { ItemCategory } from "../interfaces/item.interface";
import { ItemService } from "../services/item.service";
// import { MenuProps } from "ant-design-vue";

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

const searchInCategory = ref<ItemCategory>();
const defineSearchScope = (category: ItemCategory) => {
  searchInCategory.value = category;
};

watch(
  () => route.name,
  () => {
    if (route.name != routeNames.MARKETPLACE_BY_CATEGORY) {
      searchInCategory.value = undefined;
    }
  }
);

const searchKeyword = ref<string>();

const onSearch = (value: string, _event: any) => {
  router.push({
    name: routeNames.MARKETPLACE_SEARCH,
    query: { q: value, category: searchInCategory.value?.id },
  });
};
</script>
<style scoped>
.menu-layout-container {
  height: calc(100vh);
}

.menu-layout__a-layout-content {
  background-color: white;
  padding: 24px 74px 74px 74px;
  overflow: scroll;
}
.menu-layout__router-container {
  background-color: white;
  /* padding: 24px; */
  min-height: calc(100vh - 64px - 100px - 48px - 10px);
}
/* 64px is header height */
/* 100px is total margin top and bottom */
/* 48px  is total padding top and bottom */
/* 5px is scroll horizontal height */

.header-menu > a {
  margin-left: 15px;
  font-size: 20px;
  color: #D6763C;
  /* #f56a00; */
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
  padding: 0px 74px;
  /* margin: 24px 0px */
}

.item-category {
  padding: 0px 74px;
  background-color: #f0f2f5;
  border-top: solid 0.5px gainsboro;
  border-bottom: solid 0.5px gainsboro;
  /* #5b9397; */
  /* #f7f8fa; */
}

.item-category > ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.item-category li {
  float: left;
}

.item-category li a {
  display: block;
  color: #2d5377;
  /* white; */
  text-align: center;
  padding: 5px 16px;
  text-decoration: none;
  font-weight: 400;
}

/* Change the link color to #111 (black) on hover */
.item-category li a:hover {
  background-color: #67918d40;
}
</style>
