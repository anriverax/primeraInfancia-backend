import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetTeacherCountsByAgeChildrenQuery } from "../get-teacher-counts-by-age-children.query";

@QueryHandler(GetTeacherCountsByAgeChildrenQuery)
export class GetTeacherCountsByAgeChildrenHandler
  implements IQueryHandler<GetTeacherCountsByAgeChildrenQuery>
{
  constructor(private prisma: PrismaService) {}

  async execute(): Promise<{ textQuestion: string | null; count: number }[]> {
    const records = await this.prisma.answer.groupBy({
      by: ["valueText"],
      _count: { id: true },
      where: {
        valueText: "Anexo 2"
        //textQuestion: "Edad de los niños y niñas"
      }
    });

    return records.map((item) => ({
      textQuestion: item.valueText,
      count: item._count.id
    }));
  }
}
