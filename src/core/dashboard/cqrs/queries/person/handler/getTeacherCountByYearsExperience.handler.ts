import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetTeacherCountByYearExperienceQuery } from "../queries/getTeacherCountByYearExperiencie.query";
import { IGroupCount } from "@/core/dashboard/dto/dashboard.type";

@QueryHandler(GetTeacherCountByYearExperienceQuery)
export class GetTeacherCountsByYearsExperienceHandler {
  constructor(private prisma: PrismaService) {}

  async execute(): Promise<IGroupCount[]> {
    const records = await this.prisma.appendixTest.groupBy({
      by: ["textAnswer"],
      _count: { id: true },
      where: {
        name: "Anexo 2",
        textQuestion: "Años de experiencia docente"
      }
    });

    return records.map((item) => ({
      label: item.textAnswer,
      count: item._count.id
    }));
  }
}
