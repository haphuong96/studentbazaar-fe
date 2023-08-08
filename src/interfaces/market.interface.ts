export interface University {
  id: number;
  universityName: string;
  emailAddressDomain?: string;
  campuses: Campus[];
}

export interface Campus {
  id: number;
  campusName: string;
  universities?: University[];
}

export interface PickUpLocation {
  id: number;
  name: string;
  address: string;
  university?: University;
  campusLocation?: Campus;
}

export interface PickUpLocationQuery {
    universityId?: number;
    campusLocationId?: number;
}