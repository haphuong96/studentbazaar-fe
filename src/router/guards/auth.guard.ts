import { RouteLocationNormalized } from "vue-router";
import { localStorageKeys } from "../../common/storage-keys";
import { routeNames } from "../route-names";
// import { message } from "ant-design-vue";

export const globalGuard = (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized
) => {
  const accessToken: string | null = localStorage.getItem(
    localStorageKeys.ACCESS_TOKEN
  );
  if (accessToken && to.meta.isAuthRoute) {
    return { name: routeNames.MARKETPLACE_HOME };
  }
  if (!accessToken && !to.meta.isAuthRoute) {
    return { name: routeNames.LOGIN };
  }
};

export const emailSendGuard = (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized
) => {
  if (to.name === routeNames.EMAIL_VERIFICATION_SEND) {
    const emailAddress: string | null = localStorage.getItem(localStorageKeys.EMAIL_ADDRESS);
    if (!emailAddress) {
      return { name: routeNames.SIGNUP_ACCOUNT_DETAILS };
    }
  }
};
