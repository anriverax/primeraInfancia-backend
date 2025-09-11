import { MenuItem, Permission } from "@prisma/client";
export declare function getMenuItems(menus: MenuItem[], permissions: Permission[]): Promise<{
    menuId: number;
    permissionId: number;
}[]>;
