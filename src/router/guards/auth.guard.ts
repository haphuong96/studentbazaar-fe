import { RouteLocationNormalized } from "vue-router";
import {
  localStorageKeys,
} from "../../common/storage-keys";
import { routeNames } from "../route-names";
import { UserStatus } from "../../common/user-status";
// import { message } from "ant-design-vue";

export const globalGuard = (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized
) => {
  const accessToken: string | null = localStorage.getItem(
    localStorageKeys.ACCESS_TOKEN
  );
  if (accessToken) {
    if (to.meta.isAuthRoute) {
      return { name: routeNames.MARKETPLACE_HOME };
    } else if (
      localStorage.getItem(localStorageKeys.USER_STATUS) ===
        UserStatus.VERIFIED && to.name != routeNames.WELCOME_PAGE
    ) {
      return { name: routeNames.WELCOME_PAGE };
    }
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
    const emailAddress: string | null = localStorage.getItem(
      localStorageKeys.EMAIL_ADDRESS
    );
    if (!emailAddress) {
      return { name: routeNames.SIGNUP_ACCOUNT_DETAILS };
    }
  }
};

export const WelcomeGuard = (
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized
) => {
  const userStatus: string | null = localStorage.getItem(
    localStorageKeys.USER_STATUS
  );

  if (userStatus === UserStatus.ACTIVE) {
    return { name: routeNames.MARKETPLACE_HOME };
  }
};
