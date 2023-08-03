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
        token: localStorage.getItem(localStorageKeys.ACCESS_TOKEN)
    },
    extraHeaders: {
      "Authorization": `Bearer ${localStorage.getItem(localStorageKeys.ACCESS_TOKEN)}`,
    }
});

socket.on("connect", () => {
    console.log("socket connected")
  state.value.connected = true;
});

socket.on("disconnect", (reason) => {
    console.log("socket disconnected");
  state.value.connected = false;
  if (reason === "io server disconnect") {
    AuthService.refreshToken();
    socket.connect();
  }
});

// socket.on("message", (data) => {
//     console.log("message: ", data)
// })

socket.on("exception", (response) => {
    if (response.message = ErrorCode.UNAUTHORIZED) {
        console.log("exception: ", response)
    }
})

socket.on("message", ({ message, from }) => {
  console.log('inside message')
  console.log({message, from});

  // displayUsers.value.forEach((user: any) => {
  //   if (user.userID === from) {
  //     user.messages.push(message);
  //   }
  // });
});

// socket.onAny((event, ...args) => {
//     console.log(event, args)
// })
