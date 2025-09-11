"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMenuItems = getMenuItems;
const urls_1 = require("./base/urls");
const enum_1 = require("./base/enum");
async function getMenuItems(menus, permissions) {
    const menuPermissionMap = {
        [urls_1.menuJson.dashboard]: enum_1.PermissionEnum.VIEW_DASHBOARD,
        [urls_1.menuJson.grupos]: enum_1.PermissionEnum.VIEW_GROUPS,
        [urls_1.menuJson.asistencia]: enum_1.PermissionEnum.VIEW_ATTENDANCE,
        [urls_1.menuJson.catalogos]: enum_1.PermissionEnum.VIEW_CATALOGUES,
        [urls_1.menuJson.centrosEscolares]: enum_1.PermissionEnum.VIEW_CATALOGUE_SCHOOL,
        [urls_1.menuJson.zonas]: enum_1.PermissionEnum.VIEW_CATALOGUE_ZONE
    };
    const menuPermissions = [];
    for (const menu of menus) {
        const permName = menuPermissionMap[menu.path];
        if (!permName)
            continue;
        const permission = permissions.find((p) => p.name === permName);
        if (!permission)
            continue;
        menuPermissions.push({
            menuId: menu.id,
            permissionId: permission.id
        });
    }
    return menuPermissions;
}
//# sourceMappingURL=menuItems.js.map