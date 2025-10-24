import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";

import { IGetByIdAppendix } from "@/core/appendix/dto/appendix.type";

import { Query } from "@nestjs/cqrs";

export class GetByInscriptionQuery extends Query<IGetByIdAppendix[]> {
  constructor(public readonly inscriptionId: number) {
    super();
  }
}

@QueryHandler(GetByInscriptionQuery)
export class GetByInscriptionHandler
  implements IQueryHandler<GetByInscriptionQuery, IGetByIdAppendix[]>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByInscriptionQuery): Promise<IGetByIdAppendix[]> {
    const { inscriptionId } = query;

    const rows: Array<{
      title: string | null;
      color: string | null;
      answer_count: number | bigint | null;
    }> = await this.prisma.$queryRaw`
        SELECT
          a.title,
          a.color,
          COUNT(aw.id) AS answer_count
        FROM
          "Appendix" a
        LEFT JOIN
          "Section" s ON a.id = s."appendixId"
        LEFT JOIN
          "Question" q ON s.id = q."sectionId"
        LEFT JOIN
          "Answer" aw ON q.id = aw."questionId" AND aw."inscriptionId" = ${inscriptionId}
        GROUP BY
          a.title,
          a.color
        ORDER BY
          a.title;
      `;
    //5164
    //5161
    const result: IGetByIdAppendix[] = rows.map(
      (r) =>
        ({
          // adapt keys to match IGetByIdAppendix shape; this assumes fields: title, color, answer_count
          title: r.title ?? "",
          color: r.color ?? "",
          answer_count: Number(r.answer_count ?? 0)
        }) as unknown as IGetByIdAppendix
    );

    return result;
  }
}
