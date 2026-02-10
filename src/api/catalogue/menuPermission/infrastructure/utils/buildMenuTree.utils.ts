import { MenuItem } from "prisma/generated/client";
import { IMenuItems, IMenuPermission, IRolePermission } from "../../application/dto/menuPermission.type";

export const buildUserMenuTree = (permissions: IRolePermission[]): IMenuPermission[] | [] => {
  const flatMenuItems: MenuItem[] = permissions.flatMap(
    (p: IRolePermission) => p.Permission?.MenuItems.map((m: IMenuItems) => m.Menu) ?? []
  );

  // Remove duplicate by ID
  const uniqueMenuItems: MenuItem[] = Array.from(
    new Map(flatMenuItems.map((item: MenuItem) => [item!.id, item])).values()
  );

  const menuTree = uniqueMenuItems.length > 0 ? buildMenuTree(uniqueMenuItems) : [];

  return menuTree;
};

const buildMenuTree = (items: MenuItem[], parentId: number | null = null): IMenuPermission[] | [] => {
  return items
    .filter((item: MenuItem) => item!.parentId === parentId)
    .sort((a: MenuItem, b: MenuItem) => (a.order ?? 0) - (b.order ?? 0))
    .map((item: MenuItem) => ({
      ...item,
      children: buildMenuTree(items, item.id)
    }));
};
