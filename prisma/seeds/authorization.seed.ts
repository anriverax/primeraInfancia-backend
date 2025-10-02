import { PrismaClient } from "@prisma/client";
import { getMenuItems } from "./menuItems";
import { permissionData, setPermissions } from "./base/permissions";

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
    data: permissionData,
    skipDuplicates: true
  });

  const admin = await prisma.role.findUnique({ where: { id: 1 } });
  const trainer = await prisma.role.findUnique({ where: { id: 3 } });
  const mentor = await prisma.role.findUnique({ where: { id: 4 } });
  const tech = await prisma.role.findUnique({ where: { id: 5 } });

  if (!admin || !trainer || !mentor || !tech) {
    throw new Error("Uno o más roles principales no existen en la base de datos.");
  }

  const permissions = await prisma.permission.findMany();

  await setPermissions(permissions, "A", admin.id);
  await setPermissions(permissions, "M", trainer.id);
  await setPermissions(permissions, "F", mentor.id);
  await setPermissions(permissions, "T", tech.id);

  /** ===============================
   * | links permissions to each menu |
   *  ===============================
   */

  const menuItem = await prisma.menuItem.findMany();

  const menuPermissions = await getMenuItems(menuItem, permissions);

  if (menuPermissions.length > 0) {
    await prisma.menuPermission.createMany({
      data: menuPermissions
    });
  }
}
