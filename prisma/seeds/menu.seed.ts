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

  // Menú principal: Zonas y Grupos
  await prisma.menuItem.create({
    data: {
      title: "Grupos",
      path: menuJson.grupos,
      icon: "Package"
    }
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

  // Menú principal: Asistencia
  const asistencia = await prisma.menuItem.create({
    data: {
      title: "Asistencia",
      path: menuJson.asistencia,
      icon: "Calendar"
    }
  });

  // Submenús de Asistencia
  await prisma.menuItem.createMany({
    data: [
      { title: "Talleres", path: menuJson.talleres, parentId: asistencia.id },
      { title: "Seminarios", path: menuJson.seminarios, parentId: asistencia.id },
      {
        title: "Comunidades de practica",
        path: menuJson.comunidadesPractica,
        parentId: asistencia.id
      },
      {
        title: "Sesiones sincronicas",
        path: menuJson.sesionesSincronicas,
        parentId: asistencia.id
      },
      { title: "Mentorias", path: menuJson.mentorias, parentId: asistencia.id }
    ]
  });

  // Menú principal: Triple perfil
  const triplePerfil = await prisma.menuItem.create({
    data: {
      title: "Triple perfil",
      path: menuJson.triplePerfil,
      icon: "Users"
    }
  });

  // Submenús de Triple perfil
  await prisma.menuItem.createMany({
    data: [
      {
        title: "Formadores",
        path: menuJson.formadores,
        icon: "ContactRound",
        parentId: triplePerfil.id
      },
      {
        title: "Mentores",
        path: menuJson.mentores,
        icon: "SquareUserRound",
        parentId: triplePerfil.id
      },
      {
        title: "Ténicos de apoyo",
        path: menuJson.tecnicosApoyo,
        icon: "CircleUserRound",
        parentId: triplePerfil.id
      }
    ]
  });

  // Menú principal: Docentes
  await prisma.menuItem.create({
    data: {
      title: "Docentes",
      path: menuJson.docentes,
      icon: "User"
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
        icon: "School",
        parentId: catalogo.id
      },

      {
        title: "Zonas",
        path: menuJson.zonas,
        icon: "School",
        parentId: catalogo.id
      }
    ]
  });
}
