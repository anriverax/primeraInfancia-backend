import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdSurveyDataQuery } from "./getByIdSurveyData.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdSurveyData } from "@/core/surveyData/dto/surveyData.type";

@QueryHandler(GetByIdSurveyDataQuery)
export class GetByIdSurveyDataHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByIdSurveyDataQuery): Promise<IGetByIdSurveyData | null> {
    const surveyDatas = await this.prisma.surveyData.findUnique({
      where: { id: query.id },
      select: {
        id: true,
        bash: true,
        appendixId: true,
        questionId: true,
        responseDetail: true
      }
    });

    return surveyDatas;
  }
}
