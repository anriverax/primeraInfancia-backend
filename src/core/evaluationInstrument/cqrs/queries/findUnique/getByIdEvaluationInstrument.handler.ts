import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdEvaluationInstrumentQuery } from "./getByIdEvaluationInstrument.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdEvaluationInstrument } from "@/core/evaluationInstrument/dto/evaluationInstrument.type";

@QueryHandler(GetByIdEvaluationInstrumentQuery)
export class GetByIdEvaluationInstrumentHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByIdEvaluationInstrumentQuery): Promise<IGetByIdEvaluationInstrument | null> {
    const evaluationInstruments = await this.prisma.evaluationInstrument.findUnique({
      where: { id: query.id },
      select: {
        id: true,
        instrumentName: true,
        periodicity: true,
        percentage: true
      }
    });

    return evaluationInstruments;
  }
}
