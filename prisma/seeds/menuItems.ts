import { MenuItem, Permission } from "@prisma/client";
import { menuJson } from "./base/urls";
import { PermissionEnum } from "./base/enum";
export async function getMenuItems(
  menus: MenuItem[],
  permissions: Permission[]
): Promise<{ menuId: number; permissionId: number }[]> {
  const menuPermissionMap: Record<string, PermissionEnum> = {
    [menuJson.dashboard]: PermissionEnum.VIEW_DASHBOARD,
    [menuJson.grupos]: PermissionEnum.VIEW_GROUPS,
    [menuJson.asistencia]: PermissionEnum.VIEW_ATTENDANCE,
    [menuJson.catalogos]: PermissionEnum.VIEW_CATALOGUES,
    [menuJson.centrosEscolares]: PermissionEnum.VIEW_CATALOGUE_SCHOOL,
    [menuJson.modulos]: PermissionEnum.VIEW_CATALOGUE_MODULE,
    [menuJson.zonas]: PermissionEnum.VIEW_CATALOGUE_ZONE
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
