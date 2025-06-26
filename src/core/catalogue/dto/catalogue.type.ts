import { District, Municipality, Person } from "@prisma/client";

export type IMunicipalityResponse = Pick<Municipality, "id" | "name" | "departmentId">;

export type IDistrictResponse = Pick<District, "id" | "name" | "municipalityId">;

export interface IDepartmentResponse {
  department: {
    id: number;
    name: string;
  }[];
  municipality: IMunicipalityResponse[];
  district: IDistrictResponse[];
}

export interface IPerson extends Pick<Person, "id" | "firstName" | "lastName1" | "lastName2"> {
  fullName?: string;
}
