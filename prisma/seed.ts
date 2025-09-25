import { PrismaClient } from "@prisma/client";
import { authorizationSeed } from "./seeds/authorization.seed";
import { menuSeed } from "./seeds/menu.seed";

const prisma = new PrismaClient();
async function cohorts() {
  await prisma.cohort.createMany({
    data: [
      {
        name: "COHORTE 1"
      },
      {
        name: "COHORTE 2"
      }
    ],
    skipDuplicates: true
  });
}

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

async function eventType() {
  await prisma.eventType.createMany({
    data: [
      {
        name: "Taller",
        totalHours: 60,
        cohortId: 1
      },
      {
        name: "Seminario",
        totalHours: 60,
        cohortId: 1
      },
      {
        name: "Comunidad de practica",
        totalHours: 0,
        cohortId: 1
      },
      {
        name: "Mentoria",
        totalHours: 24,
        cohortId: 1
      },
      {
        name: "Sesión sincronica",
        totalHours: 0,
        cohortId: 1
      }
    ],
    skipDuplicates: true
  });
}

async function trainingModule() {
  await prisma.trainingModule.createMany({
    data: [
      {
        name: "Módulo 1",
        cohortId: 1
      },
      {
        name: "Módulo 2",
        cohortId: 1
      },
      {
        name: "Módulo 3",
        cohortId: 1
      },
      {
        name: "Módulo 4",
        cohortId: 1
      },
      {
        name: "Módulo 5",
        cohortId: 1
      }
    ]
  });
}

export async function evaluationInstrument() {
  await prisma.evaluationInstrument.createMany({
    data: [
      {
        name: "Portafolio Digital",
        periodicity: "Durante el módulo",
        percentage: 50
      },
      {
        name: "Lista de Cotejo",
        periodicity: "Durante el módulo",
        percentage: 10
      },
      {
        name: "Cuestionario",
        periodicity: "Al finalizar el módulo",
        percentage: 10
      },
      {
        name: "Auto-evaluación",
        periodicity: "Al finalizar el módulo",
        percentage: 10
      },
      {
        name: "Proyecto Final",
        periodicity: "Al finalizar el módulo",
        percentage: 10
      }
    ],
    skipDuplicates: true
  });
}

async function main() {
  await cohorts();
  await zones();
  await typePerson();
  await eventType();
  await trainingModule();
  await evaluationInstrument();
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
