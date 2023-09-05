import { io } from "socket.io-client";
import { ref } from "vue";
import { envConfigs } from "./configs/env-configs";
import { ErrorCode } from "./common/error-code";
import { localStorageKeys } from "./common/storage-keys";
import { AuthService } from "./services/auth.service";

export const state = ref({
  connected: false,
});

const URL = envConfigs.BASE_API;

export const socket = io(URL, {
  auth: (cb) => {
    cb({
      token: `Bearer ${localStorage.getItem(localStorageKeys.ACCESS_TOKEN)}`,
    });
  },
  extraHeaders: {
    Authorization: `Bearer ${localStorage.getItem(
      localStorageKeys.ACCESS_TOKEN
    )}`,
  },
  autoConnect: false,
});

socket.on("connect", () => {
  console.log("socket connected");
  state.value.connected = true;
});

socket.on("disconnect", async (reason) => {
  console.log("socket disconnected. Reason: ", reason);
  state.value.connected = false;
});

// socket.on("message", (data) => {
//     console.log("message: ", data)
// })

socket.on("exception", async (response) => {
  console.log("exception: ", response);
});

socket.on("connect_error", async (response) => {
  console.log("connect_error: ", response);
  if (response.message === ErrorCode.UNAUTHORIZED || response.message === 'xhr poll error') {
    const isRefreshSuccess: boolean = await AuthService.refreshToken();
    if (isRefreshSuccess) {
      socket.connect();
    }
  }
});

socket.onAny((event, ...args) => {
  console.log(event, args);
});
