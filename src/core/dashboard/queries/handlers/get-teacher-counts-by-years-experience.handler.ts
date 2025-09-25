import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetTeacherCountsByYearsExperienceQuery } from "../get-teacher-counts-by-years-experience.query";

@QueryHandler(GetTeacherCountsByYearsExperienceQuery)
export class GetTeacherCountsByYearsExperienceHandler
  implements IQueryHandler<GetTeacherCountsByYearsExperienceQuery>
{
  constructor(private prisma: PrismaService) {}

  async execute(): Promise<{ textQuestion: string | null; count: number }[]> {
    const records = await this.prisma.appendixTest.groupBy({
      by: ["textAnswer"],
      _count: { id: true },
      where: {
        name: "Anexo 2",
        textQuestion: "Años de experiencia docente"
      }
    });

    return records.map((item) => ({
      textQuestion: item.textAnswer,
      count: item._count.id
    }));
  }
}
