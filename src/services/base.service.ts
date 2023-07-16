import axios, { AxiosResponse } from "axios";
import { envConfigs } from "../configs/env-configs";
import { localStorageKeys } from "../common/local-storage-keys";

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
const handleResponseError = async (error: any) => {
  // https://axios-http.com/docs/res_schema
  const originalRequest = error.config;

  if (error.response.status === 401) {
    const refreshToken = localStorage.getItem(localStorageKeys.REFRESH_TOKEN);

    const res = await axiosInstance.post("auth/refresh-token", {
      refreshToken,
    });

    if (res.status === 201) {
      localStorage.setItem(localStorageKeys.ACCESS_TOKEN, res.data.accessToken);
      localStorage.setItem(localStorageKeys.REFRESH_TOKEN, res.data.refreshToken);
    }

    return axiosInstance(originalRequest);
  }

  return Promise.reject(error);
};

axiosInstance.interceptors.response.use(
  handleResponseSuccess,
  handleResponseError
);
