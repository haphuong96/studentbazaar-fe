import { createRouter, createWebHistory } from "vue-router";
import { routeNames } from "./route-names";
import SignupPage from "../views/auth/SignupPage.vue";
import LoginPage from "../views/auth/LoginPage.vue";
import Marketplace from "../views/item/Marketplace.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: routeNames.LOGIN,
      component: LoginPage,
    },
    {
        path: "/signup",
        name: routeNames.SIGNUP,
        component: SignupPage
    },
    {
      path: "/marketplace",
      name: routeNames.MARKETPLACE,
      component: Marketplace
    }
  ],
});

export default router