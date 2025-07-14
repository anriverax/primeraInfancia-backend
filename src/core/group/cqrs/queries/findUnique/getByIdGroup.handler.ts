import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetByIdGroupQuery } from "./getByIdGroup.query";
import { IGetByIdGroup } from "@/core/group/dto/group.type";

@QueryHandler(GetByIdGroupQuery)
export class GetByIdGroupHandler {
  constructor(private readonly prisma: PrismaService) {}
  /* eslint-disable @typescript-eslint/no-explicit-any */
  async execute(query: GetByIdGroupQuery): Promise<IGetByIdGroup | null> {
    const groups = await this.prisma.group.findUnique({
      where: {
        id: query.id,
        deletedAt: null
      },
      select: {
        id: true,
        name: true,
        description: true,
        memberCount: true,
        Zone: {
          select: { id: true, name: true }
        },
        Person: {
          select: { id: true, fullName: true } as any
        },
        _count: {
          select: { GroupMember: true }
        }
      }
    });

    return groups as any;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
