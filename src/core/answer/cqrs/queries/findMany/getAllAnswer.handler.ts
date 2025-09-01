import { QueryHandler } from "@nestjs/cqrs";
import { GetAllAnswerQuery } from "./getAllAnswer.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IAnswersWithPagination } from "@/core/answer/dto/answer.type";

@QueryHandler(GetAllAnswerQuery)
export class GetAllAnswerHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllAnswerQuery): Promise<IAnswersWithPagination> {
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.answer.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          valueText: true,
          valueNumber: true,
          valueDate: true,
          valueBoolean: true,
          questionId: true,
          responseSessionId: true
        },
        orderBy: {
          id: "asc"
        }
      }),

      this.prisma.answer.count()
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
