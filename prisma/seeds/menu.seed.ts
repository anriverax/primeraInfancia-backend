import { menuJson } from "./base/urls";

import { PrismaClient } from "prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

export async function menuSeed() {
  // Menú principal: Dashboard
  const dashboard = await prisma.menuItem.create({
    data: {
      title: "Dashboard",
      order: 1,
      path: menuJson.dashboard,
      icon: "Home"
    }
  });

  await prisma.menuItem.createMany({
    data: [
      {
        title: "Asistencia",
        path: menuJson.asistenciaDashboard,
        icon: "",
        order: 1.1,
        parentId: dashboard.id
      },
      {
        title: "Evaluación",
        path: menuJson.evaluacionDashboard,
        icon: "",
        order: 1.2,
        parentId: dashboard.id
      },
      {
        title: "Mentoría",
        path: menuJson.mentoriaDashboard,
        icon: "",
        order: 1.3,
        parentId: dashboard.id
      },
      {
        title: "Participantes",
        path: menuJson.participantesDashboard,
        icon: "",
        order: 1.4,
        parentId: dashboard.id
      }
    ]
  });

  // Menú principal: Grupos
  await prisma.menuItem.create({
    data: {
      title: "Grupos",
      order: 2,
      path: menuJson.grupos,
      icon: "Package"
    }
  });

  // Menú principal: Asistencia
  await prisma.menuItem.create({
    data: {
      title: "Asistencia",
      order: 3,
      path: menuJson.asistencia,
      icon: "CalendarClock"
    }
  });

  // Menú principal: Calificaciones
  await prisma.menuItem.create({
    data: {
      title: "Calificaciones",
      path: menuJson.calificaciones,
      order: 4,
      icon: "CalendarCheck"
    }
  });

  await prisma.menuItem.create({
    data: {
      title: "Mentoría",
      order: 5,
      path: menuJson.mentoria,
      icon: "ListTodo"
    }
  });

  // Menú principal: Triple perfil

  const catalogo = await prisma.menuItem.create({
    data: {
      title: "Catálogos",
      order: 6,
      path: menuJson.catalogos,
      icon: "BookMarked"
    }
  });

  await prisma.menuItem.createMany({
    data: [
      {
        title: "Centros Educativos",
        path: menuJson.centrosEscolares,
        icon: "",
        order: 6.1,
        parentId: catalogo.id
      },
      {
        title: "Módulos Formativos",
        path: menuJson.modulos,
        icon: "",
        order: 6.2,
        parentId: catalogo.id
      },
      {
        title: "Zonas",
        path: menuJson.zonas,
        icon: "",
        order: 6.3,
        parentId: catalogo.id
      }
    ]
  });
}
