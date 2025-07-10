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
          { menuId: 1, permissionId: 5 },
          { menuId: 2, permissionId: 1 },
          { menuId: 2, permissionId: 2 },
          { menuId: 2, permissionId: 3 },
          { menuId: 2, permissionId: 4 },
          { menuId: 2, permissionId: 5 },
          { menuId: 3, permissionId: 1 },
          { menuId: 3, permissionId: 2 },
          { menuId: 3, permissionId: 3 },
          { menuId: 3, permissionId: 4 },
          { menuId: 3, permissionId: 5 },
          { menuId: 4, permissionId: 1 },
          { menuId: 4, permissionId: 2 },
          { menuId: 4, permissionId: 3 },
          { menuId: 4, permissionId: 4 },
          { menuId: 4, permissionId: 5 },
          { menuId: 5, permissionId: 1 },
          { menuId: 5, permissionId: 2 },
          { menuId: 5, permissionId: 3 },
          { menuId: 5, permissionId: 4 },
          { menuId: 5, permissionId: 5 },
          { menuId: 6, permissionId: 1 },
          { menuId: 6, permissionId: 2 },
          { menuId: 6, permissionId: 3 },
          { menuId: 6, permissionId: 4 },
          { menuId: 6, permissionId: 5 },
          { menuId: 7, permissionId: 1 },
          { menuId: 7, permissionId: 2 },
          { menuId: 7, permissionId: 3 },
          { menuId: 7, permissionId: 4 },
          { menuId: 7, permissionId: 5 },
          { menuId: 8, permissionId: 1 },
          { menuId: 8, permissionId: 2 },
          { menuId: 8, permissionId: 3 },
          { menuId: 8, permissionId: 4 },
          { menuId: 8, permissionId: 5 },
          { menuId: 9, permissionId: 1 },
          { menuId: 9, permissionId: 2 },
          { menuId: 9, permissionId: 3 },
          { menuId: 9, permissionId: 4 },
          { menuId: 9, permissionId: 5 },
          { menuId: 10, permissionId: 1 },
          { menuId: 10, permissionId: 2 },
          { menuId: 10, permissionId: 3 },
          { menuId: 10, permissionId: 4 },
          { menuId: 10, permissionId: 5 },
          { menuId: 11, permissionId: 1 },
          { menuId: 11, permissionId: 2 },
          { menuId: 11, permissionId: 3 },
          { menuId: 11, permissionId: 4 },
          { menuId: 11, permissionId: 5 },
          { menuId: 12, permissionId: 1 },
          { menuId: 12, permissionId: 2 },
          { menuId: 12, permissionId: 3 },
          { menuId: 12, permissionId: 4 },
          { menuId: 12, permissionId: 5 },
          { menuId: 13, permissionId: 1 },
          { menuId: 13, permissionId: 2 },
          { menuId: 13, permissionId: 3 },
          { menuId: 13, permissionId: 4 },
          { menuId: 13, permissionId: 5 },
          { menuId: 14, permissionId: 1 },
          { menuId: 14, permissionId: 2 },
          { menuId: 14, permissionId: 3 },
          { menuId: 14, permissionId: 4 },
          { menuId: 14, permissionId: 5 },
          { menuId: 15, permissionId: 1 },
          { menuId: 15, permissionId: 2 },
          { menuId: 15, permissionId: 3 },
          { menuId: 15, permissionId: 4 },
          { menuId: 15, permissionId: 5 },
          { menuId: 16, permissionId: 1 },
          { menuId: 16, permissionId: 2 },
          { menuId: 16, permissionId: 3 },
          { menuId: 16, permissionId: 4 },
          { menuId: 16, permissionId: 5 },
          { menuId: 17, permissionId: 1 },
          { menuId: 17, permissionId: 2 },
          { menuId: 17, permissionId: 3 },
          { menuId: 17, permissionId: 4 },
          { menuId: 17, permissionId: 5 }
        ],
        skipDuplicates: true
      });
    } catch (error) {
      handlePrismaError("MenuPermissionProjection", error);
    }
  }

  async addAdminPermission(roleId: number, permissionId: number): Promise<void> {
    try {
      await this.prisma.rolePermission.create({
        data: { isActive: true, roleId, permissionId }
      });
    } catch (error) {
      handlePrismaError("RolePermissionProjection", error);
    }
  }
}
