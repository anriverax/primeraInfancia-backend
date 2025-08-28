import { QueryHandler } from "@nestjs/cqrs";
import { GetAllGroupQuery } from "./getAllGroup.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGroup } from "@/core/group/dto/group.type";

@QueryHandler(GetAllGroupQuery)
export class GetAllGroupHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<IGroup[]> {
    const listGroup = await this.prisma.group.findMany({
      select: {
        id: true,
        Department: {
          select: { id: true, name: true }
        }
      },
      orderBy: {
        id: "asc"
      }
    });

    return listGroup;
  }
}
