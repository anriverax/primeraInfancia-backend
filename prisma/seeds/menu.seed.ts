import { PrismaClient } from "@prisma/client";
import { menuJson } from "./base/urls";
const prisma = new PrismaClient();

export async function menuSeed() {
  // Menú principal: Dashboard
  await prisma.menuItem.create({
    data: {
      title: "Dashboard",
      path: menuJson.dashboard,
      icon: "Home"
    }
  });

  // Menú principal: Grupos
  await prisma.menuItem.create({
    data: {
      title: "Grupos",
      path: menuJson.grupos,
      icon: "Package"
    }
  });

  // Menú principal: Asistencia
  await prisma.menuItem.create({
    data: {
      title: "Asistencia",
      path: menuJson.asistencia,
      icon: "CalendarClock"
    }
  });

  await prisma.menuItem.create({
    data: {
      title: "Mentoría",
      path: menuJson.mentoria,
      icon: "ListTodo"
    }
  });
  // Menú principal: Triple perfil
  await prisma.menuItem.create({
    data: {
      title: "Usuarios",
      path: menuJson.triplePerfil,
      icon: "Users"
    }
  });

  const catalogo = await prisma.menuItem.create({
    data: {
      title: "Catálogos",
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
        parentId: catalogo.id
      },
      {
        title: "Módulos Formativos",
        path: menuJson.modulos,
        icon: "",
        parentId: catalogo.id
      },
      {
        title: "Zonas",
        path: menuJson.zonas,
        icon: "",
        parentId: catalogo.id
      }
    ]
  });

  // Menú principal: Evaluaciones
  const evaluaciones = await prisma.menuItem.create({
    data: {
      title: "Evaluaciones",
      path: menuJson.evaluaciones,
      icon: "CalendarCheck"
    }
  });

  // Submenús de Evaluaciones
  await prisma.menuItem.createMany({
    data: [
      {
        title: "Auto-evaluación",
        path: menuJson.autoEvaluacion,
        parentId: evaluaciones.id
      },
      {
        title: "Portafolio",
        path: menuJson.portafolio,
        parentId: evaluaciones.id
      },
      {
        title: "Diagnostico",
        path: menuJson.diagnostico,
        parentId: evaluaciones.id
      }
    ]
  });
}
