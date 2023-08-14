import { createRouter, createWebHistory } from "vue-router";
import EmailVerificationSend from "../views/auth/EmailVerificationSend.vue";
import EmailVerificationVerify from "../views/auth/EmailVerificationVerify.vue";
import LoginPage from "../views/auth/LoginPage.vue";
import SignupAccountDetails from "../views/auth/SignupAccountDetails.vue";
import SignupPage from "../views/auth/SignupPage.vue";
import Welcome from "../views/auth/Welcome.vue";
import Inbox from "../views/chat/Inbox.vue";
import ItemDetails from "../views/item/ItemDetails.vue";
import ListNewItem from "../views/item/ListNewItem.vue";
import MarketplaceByCategory from "../views/item/MarketplaceByCategory.vue";
import MarketplaceHome from "../views/item/MarketplaceHome.vue";
import MyPage from "../views/me/MyPage.vue";
import MyProfile from "../views/me/MyProfile.vue";
import MyItems from "../views/me/MyItems.vue";
import UserProfile from "../views/me/UserProfile.vue";
import MessagePanel from "../views/chat/MessagePanel.vue";
import { emailSendGuard, globalGuard } from "./guards/auth.guard";
import { layoutNames } from "./layout-names";
import { routeNames } from "./route-names";
import EditItemVue from "../views/item/EditItem.vue";

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
          path: "email/send",
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
      path: "/welcome",
      name: routeNames.WELCOME_PAGE,
      meta: {
        layout: layoutNames.FULLSCREEN_LAYOUT,
      },
      // beforeEnter: WelcomeGuard,
      component: Welcome,
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
      props: true,
    },
    {
      path: "/marketplace/search",
      name: routeNames.MARKETPLACE_SEARCH,
      meta: {
        canBack: true,
        layout: layoutNames.MENU_LAYOUT,
      },
      component: MarketplaceByCategory,
      props: (route) => ({
        searchKeyword: route.query.q,
        categoryId: route.query.category,
      }),
    },
    {
      path: "/marketplace/items/:itemId",
      name: routeNames.MARKETPLACE_ITEMS_ITEM_DETAILS,
      meta: {
        canBack: true,
        layout: layoutNames.MENU_LAYOUT,
      },
      component: ItemDetails,
      props: true,
    },
    {
      path: "/marketplace/items/:itemId/edit",
      name: routeNames.EDIT_ITEM,
      meta: {
        canBack: true,
        layout: layoutNames.MENU_LAYOUT,
      },
      component: EditItemVue,
      props: true,
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
      path: "/me",
      meta: {
        pageTitle: "Personal Details",
        layout: layoutNames.MENU_LAYOUT,
      },
      component: MyPage,
      children: [
        {
          path: "profile",
          name: routeNames.MY_PROFILE,
          component: MyProfile,
        },
        {
          path: "items",
          name: routeNames.MY_ITEMS,
          component: MyItems,
        },
      ],
    },
    {
      path: "/inbox",
      meta: {
        pageTitle: "Inbox",
        layout: layoutNames.MENU_LAYOUT,
      },
      name: routeNames.INBOX,
      component: Inbox,
      children: [
        {
          path: ":conversationId",
          name: routeNames.INBOX_CONVERSATION,
          component: MessagePanel,
          props: true,
        }
      ]
    },
    {
      path: "/user/:userId",
      name: routeNames.USER_PROFILE,
      meta: {
        canBack: true,
        layout: layoutNames.MENU_LAYOUT,
      },
      component: UserProfile,
      props: true,
    },
  ],
});

router.beforeEach(globalGuard);

export default router;
