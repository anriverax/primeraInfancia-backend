import { PrismaClient } from "@prisma/client";
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

  await prisma.permissionType.createMany({
    data: [
      {
        name: "CREAR"
      },
      {
        name: "EDITAR"
      },
      {
        name: "ELIMINAR"
      },
      {
        name: "VER"
      },
      { name: "LEER" }
    ],
    skipDuplicates: true
  });
}
