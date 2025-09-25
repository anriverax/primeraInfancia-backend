import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetTeacherCountsByEducationalLevelServedQuery } from "../get-teacher-counts-by-educational-level-served.query";

@QueryHandler(GetTeacherCountsByEducationalLevelServedQuery)
export class GetTeacherCountsByEducationalLevelServedHandler
  implements IQueryHandler<GetTeacherCountsByEducationalLevelServedQuery> {
  constructor(private prisma: PrismaService) { }

  async execute(): Promise<{ textQuestion: string | null; count: number }[]> {
    const records = await this.prisma.appendixTest.groupBy({
      by: ["textAnswer"],
      _count: { id: true },
      where: {
        name: "Anexo 2",
        textQuestion: "Nivel educativo que atiende"
      }
    });

    return records.map((item) => ({
      textQuestion: item.textAnswer,
      count: item._count.id
    }));
  }
}
