import { PrismaClient } from "prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

export async function evaluationInstrument() {
  await prisma.evaluationInstrument.create({
    data: {
      name: "Portafolio Digital",
      periodicity: "Durante el módulo",
      code: "PD-001",
      percentage: 50,
      EvaluationInstrumentDetail: {
        create: Array.from({ length: 5 }, (_, i) => ({
          description: `Módulo ${i + 1}`,
          percentage: 10,
          moduleNumber: i + 1
        }))
      }
    }
  });

  await prisma.evaluationInstrument.create({
    data: {
      name: "Lista de cotejo de la interacción con OVAs",
      periodicity: "Durante el módulo",
      percentage: 10,
      code: "PD-002",
      EvaluationInstrumentDetail: {
        create: Array.from({ length: 5 }, (_, i) => ({
          description: `Módulo ${i + 1}`,
          percentage: 10,
          moduleNumber: i + 1
        }))
      }
    }
  });

  await prisma.evaluationInstrument.create({
    data: {
      name: "Cuestionario",
      periodicity: "Al finalizar el módulo",
      percentage: 10,
      code: "PD-003",
      EvaluationInstrumentDetail: {
        create: [{ description: "Cuestionario final", percentage: 10 }]
      }
    }
  });

  await prisma.evaluationInstrument.create({
    data: {
      name: "Autoevaluación",
      periodicity: "Al finalizar la formación",
      percentage: 10,
      code: "PD-004",
      EvaluationInstrumentDetail: {
        create: [{ description: "Autoevaluación final", percentage: 10 }]
      }
    }
  });

  await prisma.evaluationInstrument.create({
    data: {
      name: "Proyecto Final",
      periodicity: "Al finalizar la formación",
      percentage: 10,
      code: "PD-005",
      EvaluationInstrumentDetail: {
        create: [
          { description: "Documento de reflexión", percentage: 10 },
          { description: "Desarrollo del proyecto", percentage: 10 }
        ]
      }
    }
  });
}
