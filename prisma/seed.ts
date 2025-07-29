import { PrismaClient } from "@prisma/client";
import { authorizationSeed } from "./seeds/authorization.seed";
import { menuSeed } from "./seeds/menu.seed";
const prisma = new PrismaClient();

async function zones() {
  await prisma.zone.createMany({
    data: [
      {
        name: "Zona Occidental"
      },
      {
        name: "Zona Central"
      },
      {
        name: "Zona Paracentral"
      },
      {
        name: "Zona Oriental"
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


/*
async function typeContent() {
  await prisma.typeContent.createMany({
    data: [
      {
        id: 1,
        name: "In_Person_Workshop",
        createdAt: new Date()
      },
      {
        id: 2,
        name: "Webinar",
        createdAt: new Date()
      },
      {
        id: 3,
        name: "Asynchronous_Session",
        createdAt: new Date()
      },
      {
        id: 4,
        name: "Community_Of_Practice",
        createdAt: new Date()
      }
    ],
    skipDuplicates: true
  });
}
*/
async function main() {
  await zones();
  await typePerson();
  await menuSeed();
  await authorizationSeed();
  await typeContent();
  await school();
  await content();
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
