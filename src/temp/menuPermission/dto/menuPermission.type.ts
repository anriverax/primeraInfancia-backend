import { District, Municipality, MenuItem, Permission } from "prisma/generated/client";

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

export interface IMenuItemResponse extends MenuItem {
  children?: MenuItem[];
}
