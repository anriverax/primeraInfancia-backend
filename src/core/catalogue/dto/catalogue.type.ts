import { District, Municipality } from "@prisma/client";

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

export interface ITypePerson {
  id: number;
  name: string;
}
