import axios from "axios";
import { envConfigs } from "../configs/env-configs";
// import { envConfigs } from "../configs/env-configs";

export const axiosInstance = axios.create({
  baseURL: envConfigs.BASE_API,
  // process.env.VITE_BACKEND_URL
});
