import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetTeacherCountsByAgeChildrenQuery } from "../get-teacher-counts-by-age-children.query";

@QueryHandler(GetTeacherCountsByAgeChildrenQuery)
export class GetTeacherCountsByAgeChildrenHandler
  implements IQueryHandler<GetTeacherCountsByAgeChildrenQuery>
{
  constructor(private prisma: PrismaService) {}

  async execute(): Promise<{ textQuestion: string | null; count: number }[]> {
    const records = await this.prisma.appendixTest.groupBy({
      by: ["textAnswer"],
      _count: { id: true },
      where: {
        name: "Anexo 2",
        textQuestion: "Edad de los niños y niñas"
      }
    });

    return records.map((item) => ({
      textQuestion: item.textAnswer,
      count: item._count.id
    }));
  }
}
