import { QueryHandler } from "@nestjs/cqrs";
import { GetAllOptionQuery } from "./getAllOption.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IOptionsWithPagination } from "@/core/option/dto/option.type";

@QueryHandler(GetAllOptionQuery)
export class GetAllOptionHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllOptionQuery): Promise<IOptionsWithPagination> {
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.option.findMany({
        skip,
        take: limit,
        select: {
          id : true,
          text : true, value : true, questionId : true,
        },
        orderBy: {
          id: "asc"
        }
      }),

      this.prisma.option.count()
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
