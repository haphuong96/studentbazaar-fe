import { createRouter, createWebHistory } from "vue-router";
import { routeNames } from "./route-names";
import SignupPage from "../views/auth/SignupPage.vue";
import LoginPage from "../views/auth/LoginPage.vue";
import Marketplace from "../views/item/Marketplace.vue";
import ListNewItem from "../views/item/ListNewItem.vue";
import { layoutNames } from "./layout-names";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: routeNames.LOGIN,
      meta: {
        layout: layoutNames.FULLSCREEN_LAYOUT,
      },
      component: LoginPage,
    },
    {
      path: "/signup",
      name: routeNames.SIGNUP,
      meta: {
        layout: layoutNames.FULLSCREEN_LAYOUT,
      },
      component: SignupPage,
    },
    {
      path: "/marketplace",
      name: routeNames.MARKETPLACE,
      meta: {
        layout: layoutNames.MENU_LAYOUT,
      },
      component: Marketplace,
    },
    {
      path: "/items/new",
      name: routeNames.LIST_ITEM,
      meta: {
        layout: layoutNames.MENU_LAYOUT,
      },
      component: ListNewItem,
    },
  ],
});

export default router;
