import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdTrainingReportQuery } from "./getByIdTrainingReport.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdTrainingReport } from "@/core/trainingReport/dto/trainingReport.type";

@QueryHandler(GetByIdTrainingReportQuery)
export class GetByIdTrainingReportHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByIdTrainingReportQuery): Promise<IGetByIdTrainingReport | null> {
    const trainingReports = await this.prisma.trainingReport.findUnique({
      where: { id: query.id },
      select: {
        id: true,
        finalScore: true,
        status: true,
        remark: true
      }
    });

    return trainingReports;
  }
}
