import { QueryHandler } from "@nestjs/cqrs";
import { GetAllGroupQuery } from "./getAllGroup.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetGroup } from "@/core/group/dto/group.type";

@QueryHandler(GetAllGroupQuery)
export class GetAllGroupHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<IGetGroup[]> {
    const groups = await this.prisma.group.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        memberCount: true,
        Zone: {
          select: { id: true, name: true }
        },
        Person: {
          select: { id: true }
        },
        _count: {
          select: { GroupMember: true }
        }
      },
      orderBy: {
        id: "asc"
      }
    });

    return groups;
  }
}
