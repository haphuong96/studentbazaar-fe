import axios, { AxiosError, AxiosResponse } from "axios";
import { envConfigs } from "../configs/env-configs";
import { localStorageKeys } from "../common/storage-keys";
import { AuthService } from "./auth.service";
import { ErrorCode } from "../common/error-code";
import { routeNames } from "../router/route-names";
import router from "../router";

export const axiosInstanceLogin = axios.create({
  baseURL: envConfigs.BASE_API,
});

export const axiosInstance = axios.create({
  baseURL: envConfigs.BASE_API,
});

// Add a request interceptor, attach token to authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(localStorageKeys.ACCESS_TOKEN);

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor, refresh token if expired
const handleResponseSuccess = (
  response: AxiosResponse<any, any>
): AxiosResponse<any, any> => {
  return response;
};
/**
 * User cannot access system without logging in first.
 * @param error 
 * @returns 
 */
const handleResponseError = async (error: any) => {
  // https://axios-http.com/docs/res_schema
  const originalRequest = error.config;

  if (error.response.status === 401) {
    // if errorCode is UNAUTHORIZED_REFRESH_TOKEN, it means refresh token expires and must login again.
    // if errorCode is UNAUTHORIZED_LOGIN, it means user provides invalid credentials to login.
    // only errorCode UNAUTHORIZED:
    // - If no access token yet, route to login page
    // - If access token, refresh token and call request again.
    if (error.response.data.errorCode === ErrorCode.UNAUTHORIZED) {
      if (localStorage.getItem(localStorageKeys.ACCESS_TOKEN)) {
        //meaning expired token, now refresh
        const isRefreshSuccess : boolean = await AuthService.refreshToken();

        if (isRefreshSuccess) {
          return axiosInstance(originalRequest); //resend request with new token
        }
        // const refreshToken = localStorage.getItem(
        //   localStorageKeys.REFRESH_TOKEN
        // );

        // const res = await axiosInstance.post("auth/refresh-token", {
        //   refreshToken,
        // });

        // if (res.status === 201) {
        //   // refresh token success
        //   localStorage.setItem(
        //     localStorageKeys.ACCESS_TOKEN,
        //     res.data.accessToken
        //   );
        //   localStorage.setItem(
        //     localStorageKeys.REFRESH_TOKEN,
        //     res.data.refreshToken
        //   );

          
        // }
      } else {
        router.push({ name: routeNames.LOGIN });
      }
    } else if (
      error.response.data.errorCode === ErrorCode.UNAUTHORIZED_REFRESH_TOKEN
    ) {
      AuthService.logOut();
    }
  }
  return Promise.reject(error);
};
axiosInstance.interceptors.response.use(
  handleResponseSuccess,
  handleResponseError
);
