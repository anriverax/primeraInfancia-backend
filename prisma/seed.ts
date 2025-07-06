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
        name: "TALLER PRESENCIAL",
        createdAt: new Date()
      },
      {
        id: 2,
        name: "WEBINAR",
        createdAt: new Date()
      },
      {
        id: 3,
        name: "SESIÓN ASINCRÓNICA",
        createdAt: new Date()
      },
      {
        id: 4,
        name: "COMUNIDAD DE PRÁCTICA",
        createdAt: new Date()
      }
    ],
    skipDuplicates: true
  });
}

async function school() {
  await prisma.school.createMany({
    data: [{
      "name": "",
      "sector": "PÚBLICO", // PÚBLICO | PRIVADO
      "districtId": 50,
      "address": "",
      "email": "email@email.com",
      "coordenates": "(10,-3)",
      "phoneNumber": "",
      "createdAt": new Date(),
      "createdBy": 1
    }]
  })

}

// async function seminar() {
//   await prisma.seminar.createMany({
//     data: [{
//       "name": "",
//       "date": "",
//       "duration": 0.0,
//       "modality": "PRESENCIAL", // PRESENCIAL | SINCRÓNICO
//       "createdAt": new Date(),
//       "createdBy": 1
//     }]
//   })
// }

// async function module() {
//   await prisma.module.createMany({
//     data: [
//       {
//         id: 1,
//         name: "Módulo 1",
//         createdAt: new Date()
//       },
//       {
//         id: 2,
//         name: "Módulo 2",
//         createdAt: new Date()
//       },
//       {
//         id: 3,
//         name: "Módulo 3",
//         createdAt: new Date()
//       },
//       {
//         id: 4,
//         name: "Módulo 4",
//         createdAt: new Date()
//       },
//       {
//         id: 5,
//         name: "Módulo 5",
//         createdAt: new Date()
//       }
//     ],
//     skipDuplicates: true
//   });
// }

async function content() {
  await prisma.content.createMany({
    data: [{
      "name": "",
      "duration": 0.0,
      "modality": "PRESENCIAL", // PRESENCIAL | SINCRÓNICO
      "typeContentId": 1,
      "createdAt": new Date(),
      "createdBy": 1
    }]
  })
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




*/
async function main() {
  // await modulePermission();
  // await rolePermission();
  await typePerson();
  await authorizationSeed();
  await menuSeed();
  await typeContent();
  await school();
  //await seminar();
  await content();
  //  await module();
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
