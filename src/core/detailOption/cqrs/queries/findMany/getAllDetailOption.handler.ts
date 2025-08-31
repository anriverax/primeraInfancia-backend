import { QueryHandler } from "@nestjs/cqrs";
import { GetAllDetailOptionQuery } from "./getAllDetailOption.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IDetailOptionsWithPagination } from "@/core/detailOption/dto/detailOption.type";

@QueryHandler(GetAllDetailOptionQuery)
export class GetAllDetailOptionHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllDetailOptionQuery): Promise<IDetailOptionsWithPagination> {
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.detailOption.findMany({
        skip,
        take: limit,
        select: {
          id : true,
          textToDisplay : true, optionId : true,
        },
        orderBy: {
          id: "asc"
        }
      }),

      this.prisma.detailOption.count()
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
