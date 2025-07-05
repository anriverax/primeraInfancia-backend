import {
  District,
  Menu,
  MenuPermission,
  Municipality,
  PermissionType,
  Person,
  RolePermission
} from "@prisma/client";

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

export interface IPermission extends Menu {
  action: PermissionType;
}
export interface IGetAllMenuPermission extends MenuPermission {
  Menu: Menu;
  PermissionType: PermissionType;
}

export interface IGetAllRolePermission extends RolePermission {
  MenuPermission: IGetAllMenuPermission;
}
