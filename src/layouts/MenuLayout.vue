<template>
  <a-layout class="layout">
    <a-layout-header class="header-container">
      <div class="d-flex justify-space-between header-container__layout">
        <img class="img-logo" src="@/assets/logo.svg" />
        <a-input-search placeholder="input search text" style="width: 320px" />
        <div class="avatar-container">
          <MailOutlined class="icon"></MailOutlined>
          <BellOutlined class="icon"></BellOutlined>
          <a-dropdown placement="bottomRight">
            <a-avatar :size="40">
              <template #icon><UserOutlined /></template>
            </a-avatar>
            <template #overlay>
              <a-menu>
                <a-menu-item> Item 1 </a-menu-item>
                <a-menu-item> Item 2 </a-menu-item>
                <a-menu-item> Item 3 </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
    </a-layout-header>
    <a-layout-content class="content-container">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>
<script lang="ts" setup>
import {
  UserOutlined,
  BellOutlined,
  MailOutlined,
} from "@ant-design/icons-vue";
// import { routeNames } from "../router/route-names";
</script>
<style lang="scss" scoped>
.header-container {
  background-color: $white;
  border-bottom: 1px solid lightgray;
  .img-logo {
    cursor: pointer;
  }
  .header-container__layout {
    align-items: center;
    height: 100%;
    .avatar-container {
      display: flex;
      align-items: center;
      .icon {
        font-size: 24px;
        margin-right: 16px;
        color: gray;
      }
    }
  }
}
.content-container {
  height: calc(100vh - 64px);
}
</style>
