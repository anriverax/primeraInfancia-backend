import { QueryHandler } from "@nestjs/cqrs";
import { GetAllQuestionQuery } from "./getAllQuestion.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IQuestionsWithPagination } from "@/core/question/dto/question.type";

@QueryHandler(GetAllQuestionQuery)
export class GetAllQuestionHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllQuestionQuery): Promise<IQuestionsWithPagination> {
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.question.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          text: true,
          questionType: true,
          orderBy: true,
          subSection: true,
          isRequired: true,
          sectionId: true
        },
        orderBy: {
          id: "asc"
        }
      }),

      this.prisma.question.count()
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
