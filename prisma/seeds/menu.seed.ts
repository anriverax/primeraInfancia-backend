import { PrismaClient } from "@prisma/client";
import { menuJson } from "./base/urls";
const prisma = new PrismaClient();

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

  // Menú principal: Evaluaciones
  const evaluaciones = await prisma.menuItem.create({
    data: {
      title: "Evaluaciones",
      path: menuJson.evaluaciones,
      order: 4,
      icon: "CalendarCheck"
    }
  });

  // Submenús de Evaluaciones
  await prisma.menuItem.createMany({
    data: [
      {
        title: "Auto-evaluación",
        path: menuJson.autoEvaluacion,
        order: 4.1,
        parentId: evaluaciones.id
      },
      {
        title: "Portafolio",
        path: menuJson.portafolio,
        order: 4.2,
        parentId: evaluaciones.id
      },
      {
        title: "Diagnostico",
        path: menuJson.diagnostico,
        order: 4.3,
        parentId: evaluaciones.id
      }
    ]
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
      order: 7,
      path: menuJson.catalogos,
      icon: "BookMarked"
    }
  });

  await prisma.menuItem.createMany({
    data: [
      {
        title: "Centros Escolares",
        path: menuJson.centrosEscolares,
        icon: "",
        order: 7.1,
        parentId: catalogo.id
      },
      {
        title: "Módulos Formativos",
        path: menuJson.modulos,
        icon: "",
        order: 7.2,
        parentId: catalogo.id
      },
      {
        title: "Zonas",
        path: menuJson.zonas,
        icon: "",
        order: 7.3,
        parentId: catalogo.id
      }
    ]
  });
}
