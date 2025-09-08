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
