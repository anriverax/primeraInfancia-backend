import { QueryHandler } from "@nestjs/cqrs";
import { GetAllTrackingTypeQuery } from "./getAllTrackingType.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { ITrackingTypesWithPagination } from "@/core/trackingType/dto/trackingType.type";

@QueryHandler(GetAllTrackingTypeQuery)
export class GetAllTrackingTypeHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllTrackingTypeQuery): Promise<ITrackingTypesWithPagination> {
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.trackingType.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          deliveryMethod: true
        },
        orderBy: {
          id: "asc"
        }
      }),

      this.prisma.trackingType.count()
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
