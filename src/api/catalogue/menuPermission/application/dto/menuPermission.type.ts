import { Permission, MenuItem } from "prisma/generated/client";

export interface IMenuItems {
  Menu: MenuItem;
}

export interface IPermission extends Omit<Permission, "description"> {
  MenuItems: IMenuItems[];
}

export interface IRolePermission {
  Permission: IPermission | null;
}

export interface IUserMenuPermissionRes {
  Role: {
    Permissions: IRolePermission[];
  };
}

export interface IMenuPermission extends MenuItem {
  children?: MenuItem[];
}
