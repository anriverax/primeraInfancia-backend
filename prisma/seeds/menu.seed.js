"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuSeed = menuSeed;
const client_1 = require("@prisma/client");
const urls_1 = require("./base/urls");
const prisma = new client_1.PrismaClient();
async function menuSeed() {
    await prisma.menuItem.create({
        data: {
            title: "Dashboard",
            path: urls_1.menuJson.dashboard,
            icon: "Home"
        }
    });
    await prisma.menuItem.create({
        data: {
            title: "Grupos",
            path: urls_1.menuJson.grupos,
            icon: "Package"
        }
    });
    await prisma.menuItem.create({
        data: {
            title: "Asistencia",
            path: urls_1.menuJson.asistencia,
            icon: "CalendarClock"
        }
    });
    const evaluaciones = await prisma.menuItem.create({
        data: {
            title: "Evaluaciones",
            path: urls_1.menuJson.evaluaciones,
            icon: "CalendarCheck"
        }
    });
    await prisma.menuItem.createMany({
        data: [
            {
                title: "Auto-evaluación",
                path: urls_1.menuJson.autoEvaluacion,
                parentId: evaluaciones.id
            },
            {
                title: "Portafolio",
                path: urls_1.menuJson.portafolio,
                parentId: evaluaciones.id
            },
            {
                title: "Diagnostico",
                path: urls_1.menuJson.diagnostico,
                parentId: evaluaciones.id
            }
        ]
    });
    const asistencia = await prisma.menuItem.create({
        data: {
            title: "Asistencia",
            path: urls_1.menuJson.asistencia,
            icon: "Calendar"
        }
    });
    await prisma.menuItem.createMany({
        data: [
            { title: "Talleres", path: urls_1.menuJson.talleres, parentId: asistencia.id },
            { title: "Seminarios", path: urls_1.menuJson.seminarios, parentId: asistencia.id },
            {
                title: "Comunidades de practica",
                path: urls_1.menuJson.comunidadesPractica,
                parentId: asistencia.id
            },
            {
                title: "Sesiones sincronicas",
                path: urls_1.menuJson.sesionesSincronicas,
                parentId: asistencia.id
            },
            { title: "Mentorias", path: urls_1.menuJson.mentorias, parentId: asistencia.id }
        ]
    });
    const triplePerfil = await prisma.menuItem.create({
        data: {
            title: "Triple perfil",
            path: urls_1.menuJson.triplePerfil,
            icon: "Users"
        }
    });
    await prisma.menuItem.createMany({
        data: [
            {
                title: "Formadores",
                path: urls_1.menuJson.formadores,
                icon: "ContactRound",
                parentId: triplePerfil.id
            },
            {
                title: "Mentores",
                path: urls_1.menuJson.mentores,
                icon: "SquareUserRound",
                parentId: triplePerfil.id
            },
            {
                title: "Ténicos de apoyo",
                path: urls_1.menuJson.tecnicosApoyo,
                icon: "CircleUserRound",
                parentId: triplePerfil.id
            }
        ]
    });
    await prisma.menuItem.create({
        data: {
            title: "Docentes",
            path: urls_1.menuJson.docentes,
            icon: "User"
        }
    });
    const catalogo = await prisma.menuItem.create({
        data: {
            title: "Catálogos",
            path: urls_1.menuJson.catalogos,
            icon: "BookMarked"
        }
    });
    await prisma.menuItem.createMany({
        data: [
            {
                title: "Centros Escolares",
                path: urls_1.menuJson.centrosEscolares,
                icon: "School",
                parentId: catalogo.id
            },
            {
                title: "Zonas",
                path: urls_1.menuJson.zonas,
                icon: "School",
                parentId: catalogo.id
            }
        ]
    });
}
//# sourceMappingURL=menu.seed.js.map