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
        GroupLeader: {
          select: { Person: { select: { id: true, firstName: true, lastName1: true, lastName2: true } } }
        },
        _count: {
          select: { Inscription: true }
        }
      }
    });

    return groups as any;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
