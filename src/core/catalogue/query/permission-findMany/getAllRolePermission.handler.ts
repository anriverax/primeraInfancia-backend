import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllRolePermissionQuery } from "./getAllRolePermission.query";
import { IGetAllRolePermission } from "../../dto/catalogue.type";

@QueryHandler(GetAllRolePermissionQuery)
export class GetAllRolePermissionHandler implements IQueryHandler<GetAllRolePermissionQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllRolePermissionQuery): Promise<IGetAllRolePermission[]> {
    const { rolId } = query;

    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: {
        roleId: rolId,
        isActive: true
      },
      include: {
        MenuPermission: {
          include: {
            Menu: true,
            PermissionType: true
          }
        }
      }
    });

    return rolePermissions;
  }
}
