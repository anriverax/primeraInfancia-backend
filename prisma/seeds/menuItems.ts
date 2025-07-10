import { MenuItem, Permission } from "@prisma/client";
export async function getMenuItems(
  menus: MenuItem[],
  permissions: Permission[]
): Promise<{ menuId: number; permissionId: number }[]> {
  const menuPermissionMap: Record<string, string> = {
    "/admin/dashboard": "VIEW_DASHBOARD",
    "/admin/zonas-grupos": "VIEW_ZONES_GROUPS"
  };

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
