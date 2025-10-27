import { QueryHandler } from "@nestjs/cqrs";
import { GetAllSurveyDataQuery } from "./getAllSurveyData.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { ISurveyDatasWithPagination } from "@/core/surveyData/dto/surveyData.type";

@QueryHandler(GetAllSurveyDataQuery)
export class GetAllSurveyDataHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllSurveyDataQuery): Promise<ISurveyDatasWithPagination> {
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.surveyData.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          appendixId: true,
          survey: true,
          inscriptionId: true
        },
        orderBy: {
          id: "asc"
        }
      }),

      this.prisma.surveyData.count()
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
