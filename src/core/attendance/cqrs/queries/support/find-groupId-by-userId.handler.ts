import { PrismaService } from "@/services/prisma/prisma.service";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindGroupIdByUserIdQuery } from "./find-groupId-by-userId.query";

@QueryHandler(FindGroupIdByUserIdQuery)
export class FindGroupIdByUserIdHandler implements IQueryHandler<FindGroupIdByUserIdQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: FindGroupIdByUserIdQuery): Promise<{ id: number; groupId: number } | null> {
    const { userId, isUser } = query;

    const where = isUser
      ? {
          Person: {
            User: {
              id: userId
            }
          }
        }
      : {
          personId: userId
        };

    return await this.prisma.groupStaff.findFirst({
      where,
      select: {
        id: true,
        groupId: true
      }
    });
  }
}
