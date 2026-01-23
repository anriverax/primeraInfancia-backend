import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetRolByIdQuery } from "./get-rol-by-id.query";
import { IAuthRolePermission, IGetAllAuthRolePermission } from "@/core/auth/application/dto/auth.type";

@QueryHandler(GetRolByIdQuery)
export class GetRolByIdHandler implements IQueryHandler<GetRolByIdQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetRolByIdQuery): Promise<string[]> {
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
