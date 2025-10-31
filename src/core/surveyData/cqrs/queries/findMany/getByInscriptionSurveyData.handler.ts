import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetByInscriptionSurveyDataQuery } from "./getByInscriptionSurveyData.query";
import { IGetAllSurveyData } from "@/core/surveyData/dto/surveyData.type";
import { Prisma } from "@prisma/client";

@Injectable()
@QueryHandler(GetByInscriptionSurveyDataQuery)
export class GetByInscriptionSurveyDataHandler
  implements IQueryHandler<GetByInscriptionSurveyDataQuery, IGetAllSurveyData[]>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByInscriptionSurveyDataQuery): Promise<IGetAllSurveyData[]> {
    const { inscriptionId, appendixId } = query;

    const where: Prisma.SurveyDataWhereInput = { inscriptionId };
    if (typeof appendixId === "number" && !Number.isNaN(appendixId)) {
      where.appendixId = appendixId;
    }

    const rows = await this.prisma.surveyData.findMany({
      where,
      select: {
        id: true,
        appendixId: true,
        survey: true,
        inscriptionId: true
      },
      orderBy: { id: "asc" }
    });

    return rows.map((r) => ({
      id: r.id,
      appendixId: r.appendixId,
      survey: r.survey,
      inscriptionId: r.inscriptionId
    }));
  }
}
