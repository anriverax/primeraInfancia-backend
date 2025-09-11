"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationSeed = authorizationSeed;
const client_1 = require("@prisma/client");
const menuItems_1 = require("./menuItems");
const enum_1 = require("./base/enum");
const prisma = new client_1.PrismaClient();
async function authorizationSeed() {
    await prisma.role.createMany({
        data: [
            {
                name: "ADMIN"
            },
            {
                name: "USER"
            },
            {
                name: "USER_FORMADOR"
            },
            { name: "USER_MENTOR" },
            { name: "USER_TECNICO_APOYO" },
            { name: "USER_DOCENTE" },
            { name: "USER_DIRECTOR" }
        ],
        skipDuplicates: true
    });
    await prisma.permission.createMany({
        data: [
            {
                name: enum_1.PermissionEnum.VIEW_DASHBOARD,
                description: "Ver dashboard"
            },
            { name: enum_1.PermissionEnum.VIEW_GROUPS, description: "Ver grupos" },
            { name: enum_1.PermissionEnum.VIEW_ATTENDANCE, description: "Ver asistencias" },
            { name: enum_1.PermissionEnum.VIEW_CATALOGUES, description: "Ver catálogos" },
            { name: enum_1.PermissionEnum.VIEW_CATALOGUE_SCHOOL, description: "Ver centros escolares" },
            { name: enum_1.PermissionEnum.VIEW_CATALOGUE_ZONE, description: "Ver zonas" }
        ],
        skipDuplicates: true
    });
    const admin = await prisma.role.findUnique({ where: { id: 1 } });
    const user = await prisma.role.findUnique({ where: { id: 2 } });
    const allPermissions = await prisma.permission.findMany();
    await prisma.rolePermission.createMany({
        data: allPermissions.map((p) => ({
            roleId: admin.id,
            isActive: true,
            permissionId: p.id
        }))
    });
    const userPerms = allPermissions.filter((p) => [enum_1.PermissionEnum.VIEW_ATTENDANCE].includes(p.name));
    await prisma.rolePermission.createMany({
        data: userPerms.map((p) => ({
            roleId: user.id,
            isActive: true,
            permissionId: p.id
        }))
    });
    const menuItem = await prisma.menuItem.findMany();
    const permissions = await prisma.permission.findMany();
    const menuPermissions = await (0, menuItems_1.getMenuItems)(menuItem, permissions);
    if (menuPermissions.length > 0) {
        await prisma.menuPermission.createMany({
            data: menuPermissions
        });
    }
}
//# sourceMappingURL=authorization.seed.js.map