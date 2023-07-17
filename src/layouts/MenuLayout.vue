<template>
  <a-layout class="layout">
    <a-layout-header>
      <!-- <div class="logo" /> -->
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
        <a @click="() => router.push(routeNames.MARKETPLACE)"><h3 class="logo">Student Bazaar</h3></a>
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
        <div
          class="d-flex header-menu"
        >
          <a><bell-filled /></a>
          <a @click="() => $router.push({ name: routeNames.LIST_ITEM })"
            ><plus-circle-filled
          /></a>
          <a class="ant-dropdown-link" @click.prevent>
            <a-avatar style="color: #f56a00; background-color: #fde3cf"
              >P</a-avatar
            >
          </a>
        </div>
      </div>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Home</a-breadcrumb-item>
        <a-breadcrumb-item>List</a-breadcrumb-item>
        <a-breadcrumb-item>App</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
        <router-view />
      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Ant Design ©2018 Created by Ant UED
    </a-layout-footer>
  </a-layout>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { PlusCircleFilled, BellFilled } from "@ant-design/icons-vue";
import { routeNames } from "../router/route-names";
import router from "../router";
const selectedKeys = ref<string[]>(["2"]);
</script>
<style scoped>
.site-layout-content {
  min-height: 280px;
  padding: 24px;
  background: #fff;
}
#components-layout-demo-top .logo {
  float: left;
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
  margin: 0px 20px;
}
</style>
