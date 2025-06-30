import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function role() {
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
}

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

async function module() {
  await prisma.module.createMany({
    data: [
      {
        name: "usuarios"
      },
      {
        name: "perfil"
      },
      {
        name: "permisos"
      }
    ],
    skipDuplicates: true
  });
}

async function permissionType() {
  await prisma.permissionType.createMany({
    data: [
      {
        name: "crear"
      },
      {
        name: "editar"
      },
      {
        name: "eliminar"
      },
      {
        name: "ver"
      },
      { name: "leer" }
    ],
    skipDuplicates: true
  });
}

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

async function main() {
  await role();
  await module();
  await permissionType();
  await modulePermission();
  await rolePermission();
  await typePerson();
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
