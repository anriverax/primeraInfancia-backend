//rolePermission

import { handlePrismaError } from "@/common/helpers/functions";
import { PrismaService } from "@/services/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MenuPermissionProjection {
  constructor(private prisma: PrismaService) {}

  async create(): Promise<void> {
    try {
      await this.prisma.menuPermission.createMany({
        data: [
          { menuId: 1, permissionTypeId: 1 },
          { menuId: 1, permissionTypeId: 2 },
          { menuId: 1, permissionTypeId: 3 },
          { menuId: 1, permissionTypeId: 4 },
          { menuId: 1, permissionTypeId: 5 },
          { menuId: 2, permissionTypeId: 1 },
          { menuId: 2, permissionTypeId: 2 },
          { menuId: 2, permissionTypeId: 3 },
          { menuId: 2, permissionTypeId: 4 },
          { menuId: 2, permissionTypeId: 5 },
          { menuId: 3, permissionTypeId: 1 },
          { menuId: 3, permissionTypeId: 2 },
          { menuId: 3, permissionTypeId: 3 },
          { menuId: 3, permissionTypeId: 4 },
          { menuId: 3, permissionTypeId: 5 },
          { menuId: 4, permissionTypeId: 1 },
          { menuId: 4, permissionTypeId: 2 },
          { menuId: 4, permissionTypeId: 3 },
          { menuId: 4, permissionTypeId: 4 },
          { menuId: 4, permissionTypeId: 5 },
          { menuId: 5, permissionTypeId: 1 },
          { menuId: 5, permissionTypeId: 2 },
          { menuId: 5, permissionTypeId: 3 },
          { menuId: 5, permissionTypeId: 4 },
          { menuId: 5, permissionTypeId: 5 },
          { menuId: 6, permissionTypeId: 1 },
          { menuId: 6, permissionTypeId: 2 },
          { menuId: 6, permissionTypeId: 3 },
          { menuId: 6, permissionTypeId: 4 },
          { menuId: 6, permissionTypeId: 5 },
          { menuId: 7, permissionTypeId: 1 },
          { menuId: 7, permissionTypeId: 2 },
          { menuId: 7, permissionTypeId: 3 },
          { menuId: 7, permissionTypeId: 4 },
          { menuId: 7, permissionTypeId: 5 },
          { menuId: 8, permissionTypeId: 1 },
          { menuId: 8, permissionTypeId: 2 },
          { menuId: 8, permissionTypeId: 3 },
          { menuId: 8, permissionTypeId: 4 },
          { menuId: 8, permissionTypeId: 5 },
          { menuId: 9, permissionTypeId: 1 },
          { menuId: 9, permissionTypeId: 2 },
          { menuId: 9, permissionTypeId: 3 },
          { menuId: 9, permissionTypeId: 4 },
          { menuId: 9, permissionTypeId: 5 },
          { menuId: 10, permissionTypeId: 1 },
          { menuId: 10, permissionTypeId: 2 },
          { menuId: 10, permissionTypeId: 3 },
          { menuId: 10, permissionTypeId: 4 },
          { menuId: 10, permissionTypeId: 5 },
          { menuId: 11, permissionTypeId: 1 },
          { menuId: 11, permissionTypeId: 2 },
          { menuId: 11, permissionTypeId: 3 },
          { menuId: 11, permissionTypeId: 4 },
          { menuId: 11, permissionTypeId: 5 },
          { menuId: 12, permissionTypeId: 1 },
          { menuId: 12, permissionTypeId: 2 },
          { menuId: 12, permissionTypeId: 3 },
          { menuId: 12, permissionTypeId: 4 },
          { menuId: 12, permissionTypeId: 5 },
          { menuId: 13, permissionTypeId: 1 },
          { menuId: 13, permissionTypeId: 2 },
          { menuId: 13, permissionTypeId: 3 },
          { menuId: 13, permissionTypeId: 4 },
          { menuId: 13, permissionTypeId: 5 },
          { menuId: 14, permissionTypeId: 1 },
          { menuId: 14, permissionTypeId: 2 },
          { menuId: 14, permissionTypeId: 3 },
          { menuId: 14, permissionTypeId: 4 },
          { menuId: 14, permissionTypeId: 5 },
          { menuId: 15, permissionTypeId: 1 },
          { menuId: 15, permissionTypeId: 2 },
          { menuId: 15, permissionTypeId: 3 },
          { menuId: 15, permissionTypeId: 4 },
          { menuId: 15, permissionTypeId: 5 },
          { menuId: 16, permissionTypeId: 1 },
          { menuId: 16, permissionTypeId: 2 },
          { menuId: 16, permissionTypeId: 3 },
          { menuId: 16, permissionTypeId: 4 },
          { menuId: 16, permissionTypeId: 5 },
          { menuId: 17, permissionTypeId: 1 },
          { menuId: 17, permissionTypeId: 2 },
          { menuId: 17, permissionTypeId: 3 },
          { menuId: 17, permissionTypeId: 4 },
          { menuId: 17, permissionTypeId: 5 }
        ],
        skipDuplicates: true
      });
    } catch (error) {
      handlePrismaError("MenuPermissionProjection", error);
    }
  }

  async addAdminPermission(roleId: number, menuPermissionId: number): Promise<void> {
    try {
      await this.prisma.rolePermission.create({
        data: { isActive: true, roleId, menuPermissionId }
      });
    } catch (error) {
      handlePrismaError("RolePermissionProjection", error);
    }
  }
}
