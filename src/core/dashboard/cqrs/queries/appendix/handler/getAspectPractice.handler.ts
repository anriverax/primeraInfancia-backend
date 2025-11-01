import { GetAspectPracticeCountQuery } from "../queries/getAspectPracticeCount.query";
import { IAspectPracticeCount, AspectPracticeItem } from "@/core/dashboard/dto/dashboard.type";
import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@QueryHandler(GetAspectPracticeCountQuery)
export class GetAspectPracticeCountHandler {
  constructor(private prisma: PrismaService) {}

  async execute(): Promise<IAspectPracticeCount> {
    const rawResult: AspectPracticeItem[] = await this.prisma.$queryRaw<AspectPracticeItem[]>(
      Prisma.sql`
        SELECT
            A.id AS "appendixId",
            q."text"  AS "practiceAspect",
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
        WHERE q.id in (4,115,116,118,119,120,121)
        GROUP BY
            A.id, q."text" 
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
