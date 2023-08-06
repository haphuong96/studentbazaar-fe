export interface University {
    id: number,
    universityName: string,
    emailAddressDomain?: string
    campuses: Campus[]
}

export interface Campus {
    id: number,
    campusName: string,
    universities?: University[]
}