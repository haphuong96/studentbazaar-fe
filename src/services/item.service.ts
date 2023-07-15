// import { University } from "../interfaces/market.interface";
import { axiosInstance } from "./base.service";

const getItems = async () => {
  const axiosRes = await axiosInstance.get("items"
//   , {
//     params: {
//       email: emailAddress,
//     },
//   }
  );

  const data = axiosRes.data;

  return data;
};

export const ItemService = {
    getItems,
};
