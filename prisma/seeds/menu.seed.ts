import { PrismaClient } from "@prisma/client";
import { menuJson } from "./base/urls";
const prisma = new PrismaClient();

export async function menuSeed() {
  // Menú principal: Dashboard
  await prisma.menuItem.create({
    data: {
      title: "Dashboard",
      path: menuJson.dashboard,
      icon: "Home",
      order: 1,
    }
  });

  // Menú principal: Zonas y Grupos
  await prisma.menuItem.create({
    data: {
      title: "Grupos",
      path: menuJson.grupos,
      icon: "Package",
      order: 2,
    }
  });

  // Menú principal: Asistencia
  await prisma.menuItem.create({
    data: {
      title: "Asistencia",
      path: menuJson.asistencia,
      icon: "CalendarClock",
      order: 3,
    }
  });

  // Menú principal: Evaluaciones
  const evaluaciones = await prisma.menuItem.create({
    data: {
      title: "Evaluaciones",
      path: menuJson.evaluaciones,
      icon: "CalendarCheck",
      order: 4,
    }
  });

  // Submenús de Evaluaciones
  await prisma.menuItem.createMany({
    data: [
      {
        title: "Auto-evaluación",
        path: menuJson.autoEvaluacion,
        parentId: evaluaciones.id,
        order: 1,
      },
      {
        title: "Portafolio",
        path: menuJson.portafolio,
        parentId: evaluaciones.id,
        order: 1,
      },
      {
        title: "Diagnostico",
        path: menuJson.diagnostico,
        parentId: evaluaciones.id,
        order: 1,
      }
    ]
  });

  // Menú principal: Asistencia
  const asistencia = await prisma.menuItem.create({
    data: {
      title: "Asistencia",
      path: menuJson.asistencia,
      icon: "Calendar",
      order: 1,
    }
  });

  // Submenús de Asistencia
  await prisma.menuItem.createMany({
    data: [
      { title: "Talleres", path: menuJson.talleres, parentId: asistencia.id, order: 1, },
      { title: "Seminarios", path: menuJson.seminarios, parentId: asistencia.id, order: 2 },
      {
        title: "Comunidades de practica",
        path: menuJson.comunidadesPractica,
        parentId: asistencia.id, order: 1,
      },
      {
        title: "Sesiones sincronicas",
        path: menuJson.sesionesSincronicas,
        parentId: asistencia.id, order: 2,
      },
      { title: "Mentorias", path: menuJson.mentorias, parentId: asistencia.id, order: 3 }
    ]
  });

  // Menú principal: Triple perfil
  const triplePerfil = await prisma.menuItem.create({
    data: {
      title: "Triple perfil",
      path: menuJson.triplePerfil,
      icon: "Users",
      order: 1,
    }
  });

  // Submenús de Triple perfil
  await prisma.menuItem.createMany({
    data: [
      {
        title: "Formadores",
        path: menuJson.formadores,
        icon: "ContactRound",
        parentId: triplePerfil.id,
        order: 1,
      },
      {
        title: "Mentores",
        path: menuJson.mentores,
        icon: "SquareUserRound",
        parentId: triplePerfil.id,
        order: 2,
      },
      {
        title: "Ténicos de apoyo",
        path: menuJson.tecnicosApoyo,
        icon: "CircleUserRound",
        parentId: triplePerfil.id,
        order: 3,
      }
    ]
  });

  // Menú principal: Docentes
  await prisma.menuItem.create({
    data: {
      title: "Docentes",
      path: menuJson.docentes,
      icon: "User",
      order: 1,
    }
  });

  const catalogo = await prisma.menuItem.create({
    data: {
      title: "Catálogos",
      path: menuJson.catalogos,
      icon: "BookMarked",
      order: 1
    }
  });

  await prisma.menuItem.createMany({
    data: [
      {
        title: "Centros Escolares",
        path: menuJson.centrosEscolares,
        icon: "School",
        parentId: catalogo.id,
        order: 1,
      },

      {
        title: "Zonas",
        path: menuJson.zonas,
        icon: "School",
        parentId: catalogo.id,
        order: 1,
      }
    ]
  });
}
