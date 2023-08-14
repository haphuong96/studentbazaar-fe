import { io } from "socket.io-client";
import { ref } from "vue";
import { envConfigs } from "./configs/env-configs";
import { ErrorCode } from "./common/error-code";
import { localStorageKeys } from "./common/storage-keys";
import { AuthService } from "./services/auth.service";

export const state = ref({
  connected: false,
  fooEvents: [],
  barEvents: [],
});

const URL = envConfigs.BASE_API;

export const socket = io(URL, {
  auth: {
    token: `Bearer ${localStorage.getItem(localStorageKeys.ACCESS_TOKEN)}`,
  },
  // testing purpose for now
  extraHeaders: {
    "Authorization": `Bearer ${localStorage.getItem(localStorageKeys.ACCESS_TOKEN)}`,
  }

  // autoConnect: true,
});

socket.on("connect", () => {
  console.log("socket connected");
  state.value.connected = true;
});

socket.on("disconnect", async (reason) => {
  console.log("socket disconnected");
  state.value.connected = false;
  if (reason === "io server disconnect") {
    await AuthService.refreshToken();
    socket.auth = {
      token: `Bearer ${localStorage.getItem(localStorageKeys.ACCESS_TOKEN)}`,
    };
    socket.connect();
  }
});

// socket.on("message", (data) => {
//     console.log("message: ", data)
// })

socket.on("exception", (response) => {
  if ((response.message = ErrorCode.UNAUTHORIZED)) {
    console.log("exception: ", response);
  }
});

socket.onAny((event, ...args) => {
    console.log(event, args)
})
