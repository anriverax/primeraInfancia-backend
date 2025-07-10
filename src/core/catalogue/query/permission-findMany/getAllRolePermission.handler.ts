import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllRolePermissionQuery } from "./getAllRolePermission.query";
import { IGetAllRolePermission } from "../../dto/catalogue.type";

@QueryHandler(GetAllRolePermissionQuery)
export class GetAllRolePermissionHandler implements IQueryHandler<GetAllRolePermissionQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllRolePermissionQuery): Promise<IGetAllRolePermission | null> {
    const { userId } = query;

    const userWithPermissions = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        Role: {
          select: {
            Permissions: {
              select: {
                Permission: {
                  select: {
                    id: true,
                    name: true,
                    MenuItems: {
                      select: {
                        Menu: {
                          select: {
                            id: true,
                            title: true,
                            path: true,
                            icon: true,
                            parentId: true
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    return userWithPermissions;
  }
}
