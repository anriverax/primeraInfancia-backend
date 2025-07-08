import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function menuSeed() {
  // Menú principal: Dashboard
  await prisma.menuItem.create({
    data: {
      title: "Dashboard",
      path: "/admin/dashboard",
      icon: "Home"
    }
  });

  // Menú principal: Zonas y Grupos
  await prisma.menuItem.create({
    data: {
      title: "Zonas y Grupos",
      path: "/admin/zonas-grupos",
      icon: "Package"
    }
  });

  // Menú principal: Evaluaciones
  const evaluaciones = await prisma.menuItem.create({
    data: {
      title: "Evaluaciones",
      path: "/admin/evaluaciones",
      icon: "CalendarCheck"
    }
  });

  // Submenús de Evaluaciones
  await prisma.menuItem.createMany({
    data: [
      {
        title: "Auto-evaluación",
        path: "/admin/evaluaciones/auto-evaluación",
        parentId: evaluaciones.id
      },
      {
        title: "Portafolio",
        path: "/admin/evaluaciones/portafolio",
        parentId: evaluaciones.id
      },
      {
        title: "Diagnostico",
        path: "/admin/evaluaciones/diagnostico",
        parentId: evaluaciones.id
      }
    ]
  });

  // Menú principal: Asistencia
  const asistencia = await prisma.menuItem.create({
    data: {
      title: "Asistencia",
      path: "/admin/asistencia",
      icon: "Calendar"
    }
  });

  // Submenús de Asistencia
  await prisma.menuItem.createMany({
    data: [
      { title: "Talleres", path: "/admin/asistencia/talleres", parentId: asistencia.id },
      { title: "Seminarios", path: "/admin/asistencia/seminarios", parentId: asistencia.id },
      {
        title: "Comunidades de practica",
        path: "/admin/asistencia/comunidades-practica",
        parentId: asistencia.id
      },
      {
        title: "Sesiones sincronicas",
        path: "/admin/asistencia/sesiones-sincronicas",
        parentId: asistencia.id
      },
      { title: "Mentorias", path: "/admin/asistencia/mentorias", parentId: asistencia.id }
    ]
  });

  // Menú principal: Triple perfil
  const triplePerfil = await prisma.menuItem.create({
    data: {
      title: "Triple perfil",
      path: "/admin/triple-perfil",
      icon: "Users"
    }
  });

  // Submenús de Triple perfil
  await prisma.menuItem.createMany({
    data: [
      {
        title: "Formadores",
        path: "/admin/triple-perfil/formadores",
        icon: "ContactRound",
        parentId: triplePerfil.id
      },
      {
        title: "Mentores",
        path: "/admin/triple-perfil/mentores",
        icon: "SquareUserRound",
        parentId: triplePerfil.id
      },
      {
        title: "Ténicos de apoyo",
        path: "/admin//triple-perfil/tecnicos-apoyo",
        icon: "CircleUserRound",
        parentId: triplePerfil.id
      }
    ]
  });

  // Menú principal: Docentes
  await prisma.menuItem.create({
    data: {
      title: "Docentes",
      path: "/admin/docentes",
      icon: "User"
    }
  });
}
