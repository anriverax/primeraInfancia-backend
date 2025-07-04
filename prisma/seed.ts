import { PrismaClient } from "@prisma/client";
import { authorizationSeed } from "./seeds/authorization.seed";
import { menuSeed } from "./seeds/menu.seed";
const prisma = new PrismaClient();

async function typePerson() {
  await prisma.typePerson.createMany({
    data: [
      {
        name: "DIRECTOR"
      },
      {
        name: "DOCENTE"
      },
      {
        name: "EMPLEADO"
      },
      {
        name: "FORMADOR"
      },
      {
        name: "MENTOR"
      },
      {
        name: "TECNICO_APOYO"
      }
    ],
    skipDuplicates: true
  });
}

async function typeContent() {
  await prisma.typeContent.createMany({
    data: [
      {
        id: 1,
        name: "Taller presencial",
        createdAt: new Date()
      },
      {
        id: 2,
        name: "Webinar",
        createdAt: new Date()
      },
      {
        id: 3,
        name: "Sesión asincrónica",
        createdAt: new Date()
      },
      {
        id: 4,
        name: "Comunidad de práctica",
        createdAt: new Date()
      }
    ],
    skipDuplicates: true
  });
}
/*
async function modulePermission() {
  await prisma.modulePermission.createMany({
    data: [
      {
        moduleId: 1,
        permissionTypeId: 1
      },
      {
        moduleId: 1,
        permissionTypeId: 2
      },
      {
        moduleId: 1,
        permissionTypeId: 3
      },
      {
        moduleId: 1,
        permissionTypeId: 4
      },
      {
        moduleId: 1,
        permissionTypeId: 5
      },
      { moduleId: 2, permissionTypeId: 2 },
      { moduleId: 2, permissionTypeId: 4 }
    ],
    skipDuplicates: true
  });
}

async function rolePermission() {
  await prisma.rolePermission.createMany({
    data: [
      {
        roleId: 1,
        modulePermissionId: 1,
        isActive: true
      },
      {
        roleId: 1,
        modulePermissionId: 2,
        isActive: true
      },
      {
        roleId: 1,
        modulePermissionId: 3,
        isActive: true
      },
      {
        roleId: 1,
        modulePermissionId: 4,
        isActive: true
      },
      {
        roleId: 1,
        modulePermissionId: 5,
        isActive: true
      },
      {
        roleId: 1,
        modulePermissionId: 6,
        isActive: true
      },
      {
        roleId: 1,
        modulePermissionId: 7,
        isActive: true
      }
    ],
    skipDuplicates: true
  });
}



async function unit() {
  await prisma.unit.createMany({
    data: [
      {
        id: 1,
        name: "Módulo 1",
        createdAt: new Date()
      },
      {
        id: 2,
        name: "Módulo 2",
        createdAt: new Date()
      },
      {
        id: 3,
        name: "Módulo 3",
        createdAt: new Date()
      },
      {
        id: 4,
        name: "Módulo 4",
        createdAt: new Date()
      },
      {
        id: 5,
        name: "Módulo 5",
        createdAt: new Date()
      }
    ],
    skipDuplicates: true
  });
}
*/
async function main() {
  // await modulePermission();
  // await rolePermission();
  await typePerson();
  await authorizationSeed();
  await menuSeed();
  await typeContent();
  //  await unit();
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
