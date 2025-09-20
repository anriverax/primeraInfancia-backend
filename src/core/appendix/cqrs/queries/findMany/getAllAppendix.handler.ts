import { QueryHandler } from "@nestjs/cqrs";
import { GetAllAppendixQuery } from "./getAllAppendix.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IAppendixsWithPagination } from "@/core/appendix/dto/appendix.type";

@QueryHandler(GetAllAppendixQuery)
export class GetAllAppendixHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllAppendixQuery): Promise<IAppendixsWithPagination> {
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.appendix.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          subTitle: true,
          description: true
        },
        orderBy: {
          id: "asc"
        }
      }),

      this.prisma.appendix.count()
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
