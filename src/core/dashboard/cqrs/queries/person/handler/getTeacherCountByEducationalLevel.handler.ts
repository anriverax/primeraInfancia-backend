import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetTeacherCountByEducationalLevelQuery } from "../queries/getTeacherCountByEducationalLevel ";
import { IGroupCount } from "@/core/dashboard/dto/dashboard.type";

@QueryHandler(GetTeacherCountByEducationalLevelQuery)
export class GetTeacherCountByEducationalLevelHandler {
  constructor(private prisma: PrismaService) {}
  async execute(): Promise<IGroupCount[]> {
    const records = await this.prisma.appendixTest.groupBy({
      by: ["textAnswer"],
      _count: { id: true },
      where: {
        name: "Anexo 2",
        textQuestion: "Nivel educativo que atiende"
      }
    });

    return records.map((item) => ({
      label: item.textAnswer,
      count: item._count.id
    }));
  }
}
