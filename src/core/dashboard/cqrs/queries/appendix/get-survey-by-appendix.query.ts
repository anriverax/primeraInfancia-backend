import { PrismaService } from "@/services/prisma/prisma.service";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

export class GetSurveyByAppendixQuery {
  constructor(public readonly appendixId: number) {}
}

@QueryHandler(GetSurveyByAppendixQuery)
export class GetSurveyByAppendixHandler implements IQueryHandler<GetSurveyByAppendixQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetSurveyByAppendixQuery): Promise<number> {
    const pairs = await this.prisma.surveyData.count({
      where: { appendixId: query.appendixId }
    });

    return pairs;
  }
}
