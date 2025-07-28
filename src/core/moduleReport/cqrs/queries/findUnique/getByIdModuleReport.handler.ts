import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdModuleReportQuery } from "./getByIdModuleReport.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdModuleReport } from "@/core/moduleReport/dto/moduleReport.type";

@QueryHandler(GetByIdModuleReportQuery)
export class GetByIdModuleReportHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByIdModuleReportQuery): Promise<IGetByIdModuleReport | null> {
    const moduleReports = await this.prisma.moduleReport.findUnique({
      where: { id: query.id },
      select: {
        id: true,
        moduleScore: true,
        status: true,
        trainingModuleId: true,
        enrollmentId: true
      }
    });

    return moduleReports;
  }
}
