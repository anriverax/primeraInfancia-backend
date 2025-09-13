import { QueryHandler } from "@nestjs/cqrs";
import { GetAllResponseSelectionOptionQuery } from "./getAllResponseSelectionOption.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IResponseSelectionOptionsWithPagination } from "@/core/responseSelectionOption/dto/responseSelectionOption.type";

@QueryHandler(GetAllResponseSelectionOptionQuery)
export class GetAllResponseSelectionOptionHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetAllResponseSelectionOptionQuery
  ): Promise<IResponseSelectionOptionsWithPagination> {
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.responseSelectionOption.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          answerId: true,
          optionId: true
        },
        orderBy: {
          id: "asc"
        }
      }),

      this.prisma.responseSelectionOption.count()
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
