import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdTrainingEvaluationQuery } from "./getByIdTrainingEvaluation.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdTrainingEvaluation } from "@/core/trainingEvaluation/dto/trainingEvaluation.type";

@QueryHandler(GetByIdTrainingEvaluationQuery)
export class GetByIdTrainingEvaluationHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByIdTrainingEvaluationQuery): Promise<IGetByIdTrainingEvaluation | null> {
    const trainingEvaluations = await this.prisma.trainingEvaluation.findUnique({
      where: { id: query.id },
      select: {
        id: true,
        grade: true,
        comment: true,
        evaluationInstrumentId: true,
        inscriptionId: true
      }
    });

    return trainingEvaluations;
  }
}
