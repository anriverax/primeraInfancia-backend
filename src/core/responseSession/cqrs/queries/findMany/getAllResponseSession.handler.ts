import { QueryHandler } from "@nestjs/cqrs";
import { GetAllResponseSessionQuery } from "./getAllResponseSession.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IResponseSessionsWithPagination } from "@/core/responseSession/dto/responseSession.type";

@QueryHandler(GetAllResponseSessionQuery)
export class GetAllResponseSessionHandler {
  constructor(private readonly prisma: PrismaService) { }

  async execute(query: GetAllResponseSessionQuery): Promise<IResponseSessionsWithPagination> {
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.responseSession.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          status: true,
          inscriptionId: true,
          appendixId: true,
          trackingId: true
        },
        orderBy: {
          id: "asc"
        }
      }),

      this.prisma.responseSession.count()
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
