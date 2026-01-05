import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetByRolIdQuery } from "./get-by-rol-id.query";
import { IAuthRolePermission, IGetAllAuthRolePermission } from "@/core/auth/dto/auth.type";

@QueryHandler(GetByRolIdQuery)
export class GetByRolIdHandler implements IQueryHandler<GetByRolIdQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByRolIdQuery): Promise<string[]> {
    const { rolId } = query;

    const role: IGetAllAuthRolePermission | null = await this.prisma.role.findUnique({
      where: { id: rolId },
      select: {
        Permissions: {
          select: { Permission: { select: { name: true } } }
        }
      }
    });

    if (role) {
      const result = role.Permissions.map((p: IAuthRolePermission) => {
        if (!p.Permission) return null;

        return p.Permission.name;
      }).filter(Boolean) as string[];

      return result;
    }

    return [];
  }
}
