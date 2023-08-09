<template>
  <a-layout style="padding: 24px 0px 48px 0px; background: #fff; min-height: 100vh">
    <a-layout-sider
      width="200"
      style="background: #fff"
      v-model:collapsed="collapsed"
    >
      <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        style="height: 100%"
      >
        <a-menu-item :key="routeNames.MY_ITEMS">
          <div
            class="link"
            @click="() => router.push({ name: routeNames.MY_ITEMS })"
          >
            <shop-outlined /> <span> Your List </span>
          </div>
        </a-menu-item>
        <a-menu-item key="favorites">
          <heart-outlined /><span> Favorites </span>
        </a-menu-item>
        <a-menu-item :key="routeNames.MY_PROFILE">
          <div
            class="link"
            @click="() => router.push({ name: routeNames.MY_PROFILE })"
          >
            <user-outlined /><span> Profile </span>
          </div>
        </a-menu-item>
        <a-menu-item key="settings">
          <setting-outlined /><span> Settings </span>
        </a-menu-item>
      </a-menu>
      <a-button
        type="primary"
        style="margin-bottom: 16px"
        @click="toggleCollapsed"
      >
        <!-- <span v-if="collapsed"> > </span>
      <span v-else> &lt </span> -->
        <MenuUnfoldOutlined v-if="collapsed" />
        <MenuFoldOutlined v-else />
      </a-button>
    </a-layout-sider>
    <a-layout-content :style="{ padding: '0 24px', minHeight: '280px' }">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>
<script setup lang="ts">
import { ref } from "vue";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HeartOutlined,
  ShopOutlined,
  UserOutlined,
  SettingOutlined,
  // NotificationOutlined,
} from "@ant-design/icons-vue";
import { routeNames } from "../../router/route-names";
import router from "../../router";
import { useRoute } from "vue-router";
import { RouteLocationNormalizedLoaded } from "vue-router";
import { watch, onMounted } from "vue";

const collapsed = ref<boolean>(false);
const selectedKeys = ref<string[]>([routeNames.MY_ITEMS]);

const route: RouteLocationNormalizedLoaded = useRoute();
watch(
  () => route.name,
  () => {
    console.log("route.name", route.name);
    selectedKeys.value = [route.name as string];
  }
);

const toggleCollapsed = () => {
  collapsed.value = !collapsed.value;
};

onMounted(() => {
  selectedKeys.value = [route.name as string];
})
</script>
<style>
/* #components-layout-demo-top-side .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
} */
</style>
