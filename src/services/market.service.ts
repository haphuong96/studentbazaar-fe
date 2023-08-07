import { Campus, PickUpLocation, PickUpLocationQuery } from "../interfaces/market.interface";
import { axiosInstance } from "./base.service";

const getAllCampuses = async (): Promise<Campus[]> => {
  return (await axiosInstance.get("campuses")).data;
};

const getOneCampusById = async (campusId: number | undefined): Promise<Campus> => {
  return (await axiosInstance.get(`campuses/${campusId}`)).data;
}

const getAllDeliveryLocations = async (query?: PickUpLocationQuery): Promise<PickUpLocation[]> => {
  return (await axiosInstance.get("delivery/locations", {params: {
    universityId: query?.universityId,
    campusLocationId: query?.campusLocationId,
  }})).data;
};

const getOneDeliveryLocation = async(locationId: number | null) : Promise<PickUpLocation> => {
  return (await axiosInstance.get(`delivery/locations/${locationId}`)).data;
}

export const MarketService = {
  getAllCampuses,
  getAllDeliveryLocations,
  getOneDeliveryLocation,
  getOneCampusById
};
