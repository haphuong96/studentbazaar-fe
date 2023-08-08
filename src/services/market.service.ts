import {
  Campus,
  PickUpLocation,
  PickUpLocationQuery,
  University,
} from "../interfaces/market.interface";
import { axiosInstance } from "./base.service";

const getUniversityByEmailAddress = async (emailAddress: string) : Promise<University> => {
  const university: University = (await axiosInstance.get(`university/${emailAddress}`))
    .data;
  if (!university) {
    throw new Error("No university found");
  }
  return university;
};

const getAllCampuses = async (): Promise<Campus[]> => {
  return (await axiosInstance.get("campuses")).data;
};

const getOneCampusById = async (
  campusId: number | undefined
): Promise<Campus | undefined> => {
  if (campusId) {
    return (await axiosInstance.get(`campuses/${campusId}`)).data;
  }
};

const getAllDeliveryLocations = async (
  query?: PickUpLocationQuery
): Promise<PickUpLocation[]> => {
  return (
    await axiosInstance.get("delivery/locations", {
      params: {
        universityId: query?.universityId,
        campusLocationId: query?.campusLocationId,
      },
    })
  ).data;
};

const getOneDeliveryLocation = async (
  locationId: number | null
): Promise<PickUpLocation | undefined> => {
  if (locationId) {
    return (await axiosInstance.get(`delivery/locations/${locationId}`)).data;
  }
};

export const MarketService = {
  getAllCampuses,
  getAllDeliveryLocations,
  getOneDeliveryLocation,
  getOneCampusById,
  getUniversityByEmailAddress
};
