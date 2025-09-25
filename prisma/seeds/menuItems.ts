import { MenuItem, Permission } from "@prisma/client";
import { menuPermissionMap } from "./base/urls";

export async function getMenuItems(
  menus: MenuItem[],
  permissions: Permission[]
): Promise<{ menuId: number; permissionId: number }[]> {
  const menuPermissions: { menuId: number; permissionId: number }[] = [];

  for (const menu of menus) {
    const permName = menuPermissionMap[menu.path];
    if (!permName) continue;

    const permission = permissions.find((p) => p.name === permName);
    if (!permission) continue;

    menuPermissions.push({
      menuId: menu.id,
      permissionId: permission.id
    });
  }

  return menuPermissions;
}
