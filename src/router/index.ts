import { createRouter, createWebHistory } from "vue-router";
import { routeNames } from "./route-names";
import SignupPage from "../pages/SignupPage.vue";
import LoginPage from "../pages/LoginPage.vue";

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
    }
  ],
});

export default router