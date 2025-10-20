import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllPermissionQuery } from "./getAllPermission.query";

@QueryHandler(GetAllPermissionQuery)
export class GetAllPermissionHandler implements IQueryHandler<GetAllPermissionQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<Record<string, string[]>> {
    const permissions = await this.prisma.menuPermission.findMany({
      select: {
        Menu: { select: { path: true } },
        Permission: { select: { name: true } }
      }
    });

    const map = permissions.reduce<Record<string, string[]>>((acc, row) => {
      const path = row.Menu.path;
      const perm = row.Permission.name;
      if (!acc[path]) acc[path] = [];
      if (!acc[path].includes(perm)) acc[path].push(perm);
      return acc;
    }, {});

    return map;
  }
}
