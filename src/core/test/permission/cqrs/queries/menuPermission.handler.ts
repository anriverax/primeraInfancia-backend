import { QueryHandler } from "@nestjs/cqrs";
import { MenuPermissionQuery } from "./menuPermission.query";
import { IRolePermission } from "../../permission.type";
import { PrismaService } from "@/services/prisma/prisma.service";

@QueryHandler(MenuPermissionQuery)
export class MenuPermissionHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<IRolePermission[]> {
    const result = await this.prisma.menuPermission.findMany({
      select: {
        id: true
      }
    });

    return result;
  }
}
