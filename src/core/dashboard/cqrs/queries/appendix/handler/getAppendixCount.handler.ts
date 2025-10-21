import { GetAppendixCountQuery } from "../queries/getAppendixCount.query";
import { IAppendixAnswerCount, AppendixCountItem } from "@/core/dashboard/dto/dashboard.type";
import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@QueryHandler(GetAppendixCountQuery)
export class GetAppendixCountHandler {
  constructor(private prisma: PrismaService) { }

  async execute(): Promise<IAppendixAnswerCount> {
    const rawResult: AppendixCountItem[] = await this.prisma.$queryRaw<AppendixCountItem[]>(
      Prisma.sql`
        SELECT
            A.id AS "appendixId",
            A.title AS "appendixTitle",
            CAST(COUNT(DISTINCT T2."teacherId") AS INTEGER) AS "peopleAnswered"
        FROM
            "Appendix" A
        JOIN
            "Section" S ON A.id = S."appendixId"
        JOIN
            "Question" Q ON S.id = Q."sectionId"
        JOIN
            "Answer" T1 ON Q.id = T1."questionId"
        JOIN
            "Inscription" T2 ON T1."inscriptionId" = T2.id
        GROUP BY
            A.id, A.title
        ORDER BY
            A.id
      `
    );

    return rawResult.map((item) => ({
      ...item,
      peopleAnswered: Number(item.peopleAnswered)
    }));
  }
}
