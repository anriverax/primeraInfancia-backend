import { QueryHandler } from "@nestjs/cqrs";
import { GetAllMultipleAnswerQuery } from "./getAllMultipleAnswer.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IMultipleAnswersWithPagination } from "@/core/multipleAnswer/dto/multipleAnswer.type";

@QueryHandler(GetAllMultipleAnswerQuery)
export class GetAllMultipleAnswerHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllMultipleAnswerQuery): Promise<IMultipleAnswersWithPagination> {
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.multipleAnswer.findMany({
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

      this.prisma.multipleAnswer.count()
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
