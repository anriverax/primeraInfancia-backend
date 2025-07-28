import { QueryHandler } from "@nestjs/cqrs";
import { GetAllEnrollmentMentorQuery } from "./getAllEnrollmentMentor.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IEnrollmentMentorsWithPagination } from "@/core/enrollmentMentor/dto/enrollmentMentor.type";

@QueryHandler(GetAllEnrollmentMentorQuery)
export class GetAllEnrollmentMentorHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllEnrollmentMentorQuery): Promise<IEnrollmentMentorsWithPagination> {
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.enrollmentMentor.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          enrollmentId: true,
          mentorId: true
        },
        orderBy: {
          id: "asc"
        }
      }),

      this.prisma.enrollmentMentor.count()
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
