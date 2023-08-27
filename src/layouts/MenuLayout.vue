<template>
  <a-layout class="layout menu-layout-container">
    <a-layout-header class="nav-bar-header">
      <div class="d-flex">
        <a @click="() => router.push({ name: routeNames.MARKETPLACE_HOME })">
          <img src="@/assets/logo.png" alt="logo" class="logo" />
        </a>
        <div class="d-flex flex-grow-1 align-center">
          <a-popover
            placement="bottomLeft"
            v-model:visible="visible"
            trigger="click"
          >
            <template #content>
              <div class="item-category-filter-modal__content-container">
                <div
                  :class="[
                    category.id === searchInCategory?.id
                      ? 'item-category-filter-modal__category-block__selected'
                      : 'item-category-filter-modal__category-block',
                    'mt-16',
                  ]"
                  v-for="category in itemCategories"
                  :key="category.path"
                  @click="onSelectCategory(category.path)"
                >
                  <span>{{ category.categoryName }}</span>
                  <CaretRightOutlined
                    v-if="category.children?.length"
                    class="ml-8"
                    :style="{ fontSize: '12px' }"
                  ></CaretRightOutlined>
                  <div
                    v-if="category?.children?.length"
                    v-for="subCategory in category?.children"
                    :key="subCategory.path"
                    :class="[
                      'ml-16',
                      'mt-8',
                      subCategory.id === searchInCategory?.id
                        ? 'item-category-filter-modal__category-block__selected'
                        : 'item-category-filter-modal__category-block',
                    ]"
                    @click="onSelectCategory(subCategory.path)"
                  >
                    {{ subCategory.categoryName }}
                  </div>
                </div>
              </div>
            </template>
            <a-button class="mr-16" size="large" :icon="h(CaretDownOutlined)"
              >Filter by category</a-button
            >
          </a-popover>
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
          <router-link :to="{ name: routeNames.MY_FAVORITES }"
            ><heart-outlined
          /></router-link>
          <a>
            <a-dropdown placement="bottomRight">
              <router-link :to="{ name: routeNames.MY_PROFILE }">
                <a-avatar style="color: #d6763c; background-color: #fde3cf">{{
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
import {
  BellOutlined,
  HeartOutlined,
  LeftOutlined,
  MessageOutlined,
  PlusOutlined,
  SearchOutlined,
  CaretDownOutlined,
  CaretRightOutlined,
} from "@ant-design/icons-vue";
import { ComputedRef, Ref, computed, onMounted, ref, watch, h } from "vue";
import { useRoute } from "vue-router";
import { localStorageKeys } from "../common/storage-keys";
import { ItemCategory } from "../interfaces/item.interface";
import router from "../router";
import { routeNames } from "../router/route-names";
import { AuthService } from "../services/auth.service";
import { ItemService } from "../services/item.service";

const route = useRoute();
const visible = ref<boolean>(false);
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

const onSelectCategory = (path: string): void => {
  visible.value = false;

  router.push({
    name: routeNames.MARKETPLACE_BY_CATEGORY,
    params: { categoryPath: path },
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
  min-height: calc(100vh - 64px - 100px - 48px - 10px - 12px);
}
/* 64px is header height */
/* 100px is total margin top and bottom */
/* 48px  is total padding top and bottom */
/* 5px is scroll horizontal height */

.header-menu > a {
  margin-left: 15px;
  font-size: 20px;
  color: #d6763c;
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

/* item category modal*/
.item-category-filter-modal__content-container {
  max-width: 720px;
  display: flex;
  flex-wrap: wrap;
  padding: 32px;
}

.item-category-filter-modal__category-block {
  width: 50%;
  height: auto;
  font-size: 14px;
  font-weight: 500;
  color: #2d5377;
  cursor: pointer;
}

.item-category-filter-modal__category-block__selected {
  width: 50%;
  height: auto;
  font-size: 14px;
  font-weight: 500;
  color: #1890ff;
  cursor: pointer;
}
.item-category-filter-modal__category-block :hover {
  color: #1890ff;
}

.item-category-filter-modal__category-block > span {
  cursor: pointer;
  font-weight: 500;
}

.item-category-filter-modal__category-block__seleted > span {
  cursor: pointer;
  font-weight: 500;
}

.item-category-filter-modal__content-container > ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.item-category-filter-modal__content-container li {
  float: left;
  height: 32px;
}
.item-category-filter-modal__content-container li a {
  display: block;
  color: #2d5377;
  text-align: center;
  padding: 5px 16px;
  text-decoration: none;
  font-weight: 400;
}
.item-category-filter-modal__content-container li a:hover {
  background-color: #67918d40;
}
</style>
