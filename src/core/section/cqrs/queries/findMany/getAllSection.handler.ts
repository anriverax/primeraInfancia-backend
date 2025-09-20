import { QueryHandler } from "@nestjs/cqrs";
import { GetAllSectionQuery } from "./getAllSection.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { ISectionsWithPagination } from "@/core/section/dto/section.type";

@QueryHandler(GetAllSectionQuery)
export class GetAllSectionHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllSectionQuery): Promise<ISectionsWithPagination> {
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.section.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          summary: true,
          orderBy: true,
          appendixId: true
        },
        orderBy: {
          id: "asc"
        }
      }),

      this.prisma.section.count()
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
