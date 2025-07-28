import { QueryHandler } from "@nestjs/cqrs";
import { GetAllEnrollmentQuery } from "./getAllEnrollment.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IEnrollmentsWithPagination } from "@/core/enrollment/dto/enrollment.type";

@QueryHandler(GetAllEnrollmentQuery)
export class GetAllEnrollmentHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllEnrollmentQuery): Promise<IEnrollmentsWithPagination> {
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.enrollment.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          teacherId: true,
          groupId: true,
          administrativeStatus: true
        },
        orderBy: {
          id: "asc"
        }
      }),

      this.prisma.enrollment.count()
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
