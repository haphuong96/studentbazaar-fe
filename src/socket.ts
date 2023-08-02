import { io } from "socket.io-client";
import { ref } from "vue";
import { envConfigs } from "./configs/env-configs";
import { ErrorCode } from "./common/error-code";
import { localStorageKeys } from "./common/storage-keys";

export const state = ref({
  connected: false,
  fooEvents: [],
  barEvents: [],
});

const URL = envConfigs.BASE_API;

export const socket = io(URL, {
    auth: {
        token: localStorage.getItem(localStorageKeys.ACCESS_TOKEN)
    }
});

socket.on("connect", () => {
    console.log("socket connected")
  state.value.connected = true;
});

socket.on("disconnect", () => {
    console.log("socket disconnected");
  state.value.connected = false;
});

socket.on("message", (data) => {
    console.log("message: ", data)
})

socket.on("exception", (response) => {
    if (response.message = ErrorCode.UNAUTHORIZED) {
        console.log("exception: ", response)
        
    }
    
})
