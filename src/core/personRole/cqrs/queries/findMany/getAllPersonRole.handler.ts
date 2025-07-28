import { QueryHandler } from "@nestjs/cqrs";
import { GetAllPersonRoleQuery } from "./getAllPersonRole.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IPersonRolesWithPagination } from "@/core/personRole/dto/personRole.type";

@QueryHandler(GetAllPersonRoleQuery)
export class GetAllPersonRoleHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllPersonRoleQuery): Promise<IPersonRolesWithPagination> {
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.personRole.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          typePersonId: true,
          personId: true
        },
        orderBy: {
          id: "asc"
        }
      }),

      this.prisma.personRole.count()
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
