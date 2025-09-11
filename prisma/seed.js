"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const authorization_seed_1 = require("./seeds/authorization.seed");
const menu_seed_1 = require("./seeds/menu.seed");
const prisma = new client_1.PrismaClient();
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
async function main() {
    await zones();
    await typePerson();
    await (0, menu_seed_1.menuSeed)();
    await (0, authorization_seed_1.authorizationSeed)();
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
//# sourceMappingURL=seed.js.map