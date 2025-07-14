import { QueryHandler } from "@nestjs/cqrs";
import { GetAllGroupQuery } from "./getAllGroup.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGroupsWithPagination } from "@/core/group/dto/group.type";

@QueryHandler(GetAllGroupQuery)
export class GetAllGroupHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllGroupQuery): Promise<IGroupsWithPagination> {
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.group.findMany({
        skip,
        take: limit,
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
      }),

      this.prisma.group.count()
    ]);

    const lastPage = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        currentPage: page,
        perPage: limit,
        lastPage,
        prev: page > 1 ? page - 1 : null,
        next: page < lastPage ? page + 1 : null
      }
    };
  }
}
