import { QueryHandler } from "@nestjs/cqrs";
import { GetAllMenuPermissionQuery } from "./getAllMenuPermission.query";
import { IRolePermission } from "../../permission.type";
import { PrismaService } from "@/services/prisma/prisma.service";

@QueryHandler(GetAllMenuPermissionQuery)
export class GetAllMenuPermissionHandler {
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
