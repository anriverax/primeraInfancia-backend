import { PrismaClient } from "prisma/generated/client";
import { authorizationSeed } from "./seeds/authorization.seed";
import { menuSeed } from "./seeds/menu.seed";
import { evaluationInstrument } from "./seeds/evaluationInstrument";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });
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
        name: "Seminarios",
        // totalHours: 24,
        order: 1,
        cohortId: 1
      },
      {
        name: "Mentorías",
        // totalHours: 24,
        order: 2,
        cohortId: 1
      },
      {
        name: "Talleres",
        order: 3,
        // totalHours: 60,
        cohortId: 1
      },
      {
        name: "Comunidades de práctica formativa",
        // totalHours: 0,
        order: 4,
        cohortId: 1
      },
      {
        name: "Sesiones sincrónicas",
        // totalHours: 0,
        order: 5,
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
        title: "Desarrollo Integral y aprendizaje en la Primera Infancia",
        startDate: new Date("2025-10-01"),
        endDate: new Date("2025-11-11"),
        hours: 48,
        cohortId: 1
      },
      {
        name: "Módulo 2",
        title: "El juego en la Primera Infancia",
        startDate: new Date("2025-11-12"),
        endDate: new Date("2025-12-23"),
        hours: 52,
        cohortId: 1
      },
      {
        name: "Módulo 3",
        title: "Organización Curricular de la  Educación para la Primera Infancia",
        startDate: new Date("2025-12-24"),
        endDate: new Date("2026-02-03"),
        hours: 52,
        cohortId: 1
      },
      {
        name: "Módulo 4",
        title: "Las rutinas en el proceso de desarrollo y aprendizaje",
        startDate: new Date("2026-02-04"),
        endDate: new Date("2026-03-17"),
        hours: 44,
        cohortId: 1
      },
      {
        name: "Módulo 5",
        title: "La planificación y la evaluación del proceso de dearrollo y aprendizaje",
        startDate: new Date("2026-03-18"),
        endDate: new Date("2026-04-28"),
        hours: 54,
        cohortId: 1
      }
    ]
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
