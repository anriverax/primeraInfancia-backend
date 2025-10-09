import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetTeacherCountsByEducationalLevelServedQuery } from "../get-teacher-counts-by-educational-level-served.query";

@QueryHandler(GetTeacherCountsByEducationalLevelServedQuery)
export class GetTeacherCountsByEducationalLevelServedHandler
  implements IQueryHandler<GetTeacherCountsByEducationalLevelServedQuery>
{
  constructor(private prisma: PrismaService) {}

  async execute(): Promise<{ textQuestion: string | null; count: number }[]> {
    const records = await this.prisma.answer.groupBy({
      by: ["valueText"],
      _count: { id: true },
      where: {
        valueText: "Anexo 2",
        questionId: 2
      }
    });

    return records.map((item) => ({
      textQuestion: item.valueText,
      count: item._count.id
    }));
  }
}
