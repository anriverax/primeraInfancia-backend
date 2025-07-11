import { PrismaClient } from "@prisma/client";
import { getMenuItems } from "./menuItems";
const prisma = new PrismaClient();

export async function authorizationSeed() {
  await prisma.role.createMany({
    data: [
      {
        name: "ADMIN"
      },
      {
        name: "USER"
      }
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
        name: "VIEW_DASHBOARD",
        description: "Ver dashboard"
      },
      { name: "VIEW_ZONES_GROUPS", description: "Ver zonas y grupos" },
      { name: "CREATE_ZONES_GROUPS", description: "Crear zonas y grupos" },
      { name: "EDIT_ZONES_GROUPS", description: "Editar zonas y grupos" },
      { name: "DELETE_ZONES_GROUPS", description: "Eliminar zonas y grupos" },
      { name: "VIEW_CATALOGUES", description: "Ver catálogos" },
      { name: "VIEW_CATALOGUE_SCHOOL", description: "Ver centros escolares" }
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

  const userPerms = allPermissions.filter((p) => ["VIEW_DASHBOARD"].includes(p.name));

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
