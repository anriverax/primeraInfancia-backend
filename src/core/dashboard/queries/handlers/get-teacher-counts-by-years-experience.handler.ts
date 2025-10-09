import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetTeacherCountsByYearsExperienceQuery } from "../get-teacher-counts-by-years-experience.query";

@QueryHandler(GetTeacherCountsByYearsExperienceQuery)
export class GetTeacherCountsByYearsExperienceHandler
  implements IQueryHandler<GetTeacherCountsByYearsExperienceQuery>
{
  constructor(private prisma: PrismaService) {}

  async execute(): Promise<{ textQuestion: string | null; count: number }[]> {
    const records = await this.prisma.answer.groupBy({
      by: ["valueText"],
      _count: { id: true },
      where: {
        valueText: "Anexo 2",
        questionId: 5
      }
    });

    return records.map((item) => ({
      textQuestion: item.valueText,
      count: item._count.id
    }));
  }
}
