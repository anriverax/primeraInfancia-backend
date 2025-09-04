import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGroupsWithPagination } from "@/core/group/dto/group.type";
import { GetAllGroupPaginationQuery } from "./getAllGroupPagination.query";

@QueryHandler(GetAllGroupPaginationQuery)
export class GetAllGroupPaginationHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllGroupPaginationQuery): Promise<IGroupsWithPagination> {
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.group.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          memberCount: true,
          Department: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: { Inscription: true }
          }
        },
        orderBy: {
          id: "asc"
        }
      }),

      this.prisma.group.count()
    ]);

    const lastPage = Math.ceil(total / limit);

    const groupData = data.map((group) => {
      const { Department, ...rest } = group;

      return {
        ...rest,
        department: group.Department.name
      };
    });

    return {
      data: groupData,
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
