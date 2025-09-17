import { QueryHandler } from "@nestjs/cqrs";
import { GetAllAppendixTestQuery } from "./getAllAppendixTest.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IAppendixsWithPagination } from "@/core/appendixTest/dto/appendixTest.type";

@QueryHandler(GetAllAppendixTestQuery)
export class GetAllAppendixTestHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllAppendixTestQuery): Promise<IAppendixsWithPagination> {
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.appendixTest.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          textQuestion: true,
          textAnswer: true,
          teacherRoleId: true,
          mentorRoleId: true
        },
        orderBy: {
          id: "asc"
        }
      }),

      this.prisma.appendixTest.count()
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
