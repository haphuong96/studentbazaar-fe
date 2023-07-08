import axios from "axios";
import { envConfigs } from "../configs/env-configs";

export const axiosInstance = axios.create({
  baseURL: envConfigs.BASE_API,
});
