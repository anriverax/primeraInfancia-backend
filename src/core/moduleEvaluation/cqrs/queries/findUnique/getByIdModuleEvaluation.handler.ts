import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdModuleEvaluationQuery } from "./getByIdModuleEvaluation.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdModuleEvaluation } from "@/core/moduleEvaluation/dto/moduleEvaluation.type";

@QueryHandler(GetByIdModuleEvaluationQuery)
export class GetByIdModuleEvaluationHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByIdModuleEvaluationQuery): Promise<IGetByIdModuleEvaluation | null> {
    const moduleEvaluations = await this.prisma.moduleEvaluation.findUnique({
      where: { id: query.id },
      select: {
        id: true,
        grade: true,
        comment: true,
        moduleProgressStatus: true,
        evaluationInstrumentId: true,
        inscriptionId: true
      }
    });

    return moduleEvaluations;
  }
}
