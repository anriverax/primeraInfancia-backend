import { PrismaClient } from "@prisma/client";
import { getMenuItems } from "./menuItems";
import { PermissionEnum } from "./base/enum";

const prisma = new PrismaClient();

export async function authorizationSeed() {
  await prisma.role.createMany({
    data: [
      {
        name: "ADMIN"
      },
      {
        name: "USER"
      },
      {
        name: "USER_FORMADOR"
      },
      { name: "USER_MENTOR" },
      { name: "USER_TECNICO_APOYO" },
      { name: "USER_DOCENTE" },
      { name: "USER_DIRECTOR" }
    ],
    skipDuplicates: true
  });

  /** ==============================
   * | Add permissions to each role |
   *  ==============================
   */
  await prisma.permission.createMany({
    data: [
      {
        name: PermissionEnum.VIEW_DASHBOARD,
        description: "Ver dashboard"
      },
      { name: PermissionEnum.VIEW_GROUPS, description: "Ver zonas y grupos" },
      { name: PermissionEnum.CREATE_GROUPS, description: "Crear zonas y grupos" },
      { name: PermissionEnum.EDIT_GROUPS, description: "Editar zonas y grupos" },
      { name: PermissionEnum.DELETE_GROUPS, description: "Eliminar zonas y grupos" },
      { name: PermissionEnum.VIEW_CATALOGUES, description: "Ver catálogos" },
      { name: PermissionEnum.VIEW_CATALOGUE_SCHOOL, description: "Ver centros escolares" },
      { name: PermissionEnum.VIEW_CATALOGUE_ZONE, description: "Ver zonas" }
    ],
    skipDuplicates: true
  });

  const admin = await prisma.role.findUnique({ where: { id: 1 } });
  const user = await prisma.role.findUnique({ where: { id: 2 } });

  const allPermissions = await prisma.permission.findMany();

  await prisma.rolePermission.createMany({
    data: allPermissions.map((p) => ({
      roleId: admin!.id,
      isActive: true,
      permissionId: p.id
    }))
  });

  const userPerms = allPermissions.filter((p) =>
    [PermissionEnum.VIEW_DASHBOARD].includes(p.name as PermissionEnum)
  );

  await prisma.rolePermission.createMany({
    data: userPerms.map((p) => ({
      roleId: user!.id,
      isActive: true,
      permissionId: p.id
    }))
  });

  /** ===============================
   * | links permissions to each menu |
   *  ===============================
   */

  const menuItem = await prisma.menuItem.findMany();
  const permissions = await prisma.permission.findMany();

  const menuPermissions = await getMenuItems(menuItem, permissions);

  if (menuPermissions.length > 0) {
    await prisma.menuPermission.createMany({
      data: menuPermissions
    });
  }
}
