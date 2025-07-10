import { District, Municipality, Person, MenuItem, Permission } from "@prisma/client";

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

export interface IMenuItems {
  Menu: MenuItem;
}

export interface IPermission extends Omit<Permission, "description"> {
  MenuItems: IMenuItems[];
}

export interface IRolePermission {
  Permission: IPermission | null;
}

export interface IGetAllRolePermission {
  Role: {
    Permissions: IRolePermission[];
  };
}
