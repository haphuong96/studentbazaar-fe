import { createRouter, createWebHistory } from "vue-router";
import { routeNames } from "./route-names";
import SignupPage from "../views/auth/SignupPage.vue";
import LoginPage from "../views/auth/LoginPage.vue";
import Marketplace from "../views/item/Marketplace.vue";
import ListNewItem from "../views/item/ListNewItem.vue";
import EmailVerificationSend from "../views/auth/EmailVerificationSend.vue";
import SignupAccountDetails from "../views/auth/SignupAccountDetails.vue";
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
      children: [
        {
          path: "",
          name: routeNames.SIGNUP_ACCOUNT_DETAILS,
          component: SignupAccountDetails,
        },
        {
          path: "/email/send",
          name: routeNames.EMAIL_VERIFICATION_SEND,
          component: EmailVerificationSend,
        }
      ]
    },
    {
      path: "/marketplace",
      name: routeNames.MARKETPLACE,
      meta: {
        pageTitle: "Marketplace",
        layout: layoutNames.MENU_LAYOUT,
      },
      component: Marketplace,
    },
    {
      path: "/items/new",
      name: routeNames.LIST_ITEM,
      meta: {
        canBack: true,
        layout: layoutNames.MENU_LAYOUT,
      },
      component: ListNewItem,
    },
    {
      path: "//new",
      name: routeNames.LIST_ITEM,
      meta: {
        canBack: true,
        layout: layoutNames.MENU_LAYOUT,
      },
      component: ListNewItem,
    },
  ],
});

export default router;
