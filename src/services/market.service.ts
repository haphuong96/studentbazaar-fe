import { Campus } from "../interfaces/market.interface";
import { axiosInstance } from "./base.service";

const getAllCampuses = async () : Promise<Campus[]> => {
  const axiosRes = await axiosInstance.get("campuses");

  const data = axiosRes.data;

  return data;
};

export const MarketService = {
  getAllCampuses,
};
