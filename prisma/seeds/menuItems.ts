import { MenuItem } from "@prisma/client";

export function getMenuItems(menus: MenuItem[]) {
  const map: Record<string, string> = {
    "/admin/dashboard": "VIEW_DASHBOARD",
    "/admin/zonas-grupos": "VIEW_ZONES_GROUPS"
  };

  const menuPermissions: { menuId: number; permissionId: number }[] = [];
  /*
  for (const menu of menus) {
    const permName = menuPermissionMap[menu.path];
    if (!permName) continue;

    const permission = permissions.find(p => p.name === permName);
    if (!permission) continue;

    menuPermissions.push({
      menuId: menu.id,
      permissionId: permission.id,
    });
  }

  if (menuPermissions.length > 0) {
    await prisma.menuPermission.createMany({
      data: menuPermissions,
    });
  }
}*/
}
