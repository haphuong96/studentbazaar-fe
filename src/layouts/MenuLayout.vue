<template>
  <a-layout class="layout">
    <a-layout-header>
      <!-- <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
      > -->
      <!-- <a-menu-item key="1">nav 1</a-menu-item>
          <a-menu-item key="2">nav 2</a-menu-item>
          <a-menu-item key="3">nav 3</a-menu-item> -->
      <!-- <a-avatar src=""></a-avatar> -->
      <!-- </a-menu> -->
      <div class="d-flex">
        <a @click="() => router.push({ name: routeNames.MARKETPLACE })"
          >
          <!-- <h3 class="logo">Student Bazaar</h3> -->
          <img src="@/assets/logo.jpg" alt="logo" class="logo" />
          </a
        >
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
          <a><bell-filled /></a>
          <a><message-filled /></a>
          <a @click="() => $router.push({ name: routeNames.LIST_ITEM })"
            ><tags-filled />
          </a>
          <a>
          <a-dropdown placement="bottomRight">
            <a-avatar style="color: #f56a00; background-color: #fde3cf"
              >{{ userFullname?.charAt(0).toUpperCase() }}</a-avatar
            > 
            <template #overlay>
              <a-menu>
                <a-menu-item @click="logOut"> Logout </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown></a>
        </div>
      </div>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <div class="navbar__back my-16" v-if="canBack" @click="() => router.go(-1)"> <left-outlined /> Back</div>
      <h3 class="my-16">{{ pageTitle }}</h3>
      <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
        <router-view />
      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
       Student Bazaar ©2023 Created by Phuong Nguyen
    </a-layout-footer>
  </a-layout>
</template>
<script lang="ts" setup>
import { computed, ComputedRef } from "vue";
import { PlusCircleFilled, BellFilled, LeftOutlined, UserOutlined, MessageFilled, TagsFilled } from "@ant-design/icons-vue";
import { routeNames } from "../router/route-names";
import router from "../router";
import { useRoute } from "vue-router";
import { localStorageKeys } from "../common/storage-keys";

const route = useRoute();
const pageTitle: ComputedRef<string | undefined> | any = computed(() => {
  return route.meta.pageTitle || "";
});
const canBack: ComputedRef<boolean> | any = computed(() => {
  return route.meta.canBack || false;
});

const userFullname = computed(() => {
  return localStorage.getItem(localStorageKeys.USER_FULLNAME) || localStorage.getItem(localStorageKeys.USERNAME);
});

const logOut = () => {
  localStorage.clear();
  router.push({ name: routeNames.LOGIN });
};
</script>
<style scoped>
.site-layout-content {
  min-height: 280px;
  padding: 24px;
  background: #fff;
}
#components-layout-demo-top .logo {
  float: left;
  max-width: 100%;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}
.ant-row-rtl #components-layout-demo-top .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

[data-theme="dark"] .site-layout-content {
  background: #141414;
}

.header-menu > a {
  margin-left: 15px;
  font-size: 20px;
  color: #fff;
}

.logo {
  color: #fff;
  font-size: 20px;
  margin-right: 20px;
  max-width: 120px;
}

.navbar__back {
  cursor: pointer; 
  width: fit-content;
}
</style>
