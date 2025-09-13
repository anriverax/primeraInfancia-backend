import { QueryHandler } from "@nestjs/cqrs";
import { GetAllTrackingQuery } from "./getAllTracking.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { ITrackingsWithPagination } from "@/core/tracking/dto/tracking.type";

@QueryHandler(GetAllTrackingQuery)
export class GetAllTrackingHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllTrackingQuery): Promise<ITrackingsWithPagination> {
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.tracking.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          start: true,
          finish: true,
          trackingTypeId: true
        },
        orderBy: {
          id: "asc"
        }
      }),

      this.prisma.tracking.count()
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
