import { createRouter, createWebHistory } from "vue-router";
import { routeNames } from "./route-names";
import SignupPage from "../views/auth/SignupPage.vue";
import LoginPage from "../views/auth/LoginPage.vue";
import Marketplace from "../views/item/Marketplace.vue";
import MarketplaceHome from "../views/item/MarketplaceHome.vue";
import MarketplaceByCategory from "../views/item/MarketplaceByCategory.vue";
import ListNewItem from "../views/item/ListNewItem.vue";
import EmailVerificationSend from "../views/auth/EmailVerificationSend.vue";
import SignupAccountDetails from "../views/auth/SignupAccountDetails.vue";
import EmailVerificationVerify from "../views/auth/EmailVerificationVerify.vue";
import { layoutNames } from "./layout-names";
import { emailSendGuard, globalGuard } from "./guards/auth.guard";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: { name: routeNames.MARKETPLACE_HOME },
    },
    {
      path: "/login",
      name: routeNames.LOGIN,
      meta: {
        isAuthRoute: true,
        layout: layoutNames.FULLSCREEN_LAYOUT,
      },
      component: LoginPage,
    },
    {
      path: "/signup",
      meta: {
        isAuthRoute: true,
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
        },
      ],
    },
    {
      path: "/signup/email/verify",
      name: routeNames.EMAIL_VERIFICATION_VERIFY,
      meta: {
        isAuthRoute: true,
        layout: layoutNames.FULLSCREEN_LAYOUT,
      },
      beforeEnter: emailSendGuard,
      component: EmailVerificationVerify,
    },
    {
      path: "/test",
      name: routeNames.MARKETPLACE,
      meta: {
        layout: layoutNames.MENU_LAYOUT,
      },
      component: Marketplace
    },
    {
      path: "/marketplace",
      name: routeNames.MARKETPLACE_HOME,
      meta: {
        pageTitle: "Marketplace",
        layout: layoutNames.MENU_LAYOUT,
      },
      component: MarketplaceHome,
    },
    {
      path: "/marketplace/:categoryPath",
      name: routeNames.MARKETPLACE_BY_CATEGORY,
      meta: {
        canBack: true,
        layout: layoutNames.MENU_LAYOUT,
      },
      component: MarketplaceByCategory,
      // props: true,
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
  ],
});

router.beforeEach(globalGuard);

export default router;
