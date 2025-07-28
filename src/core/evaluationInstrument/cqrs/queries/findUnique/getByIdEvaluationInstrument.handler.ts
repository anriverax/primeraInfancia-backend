import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdEvaluationInstrumentQuery } from "./getByIdEvaluationInstrument.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdEvaluationInstrument } from "@/core/evaluationInstrument/dto/evaluationInstrument.type";

@QueryHandler(GetByIdEvaluationInstrumentQuery)
export class GetByIdEvaluationInstrumentHandler {
  constructor(private readonly prisma: PrismaService) {}
/* eslint-disable @typescript-eslint/no-explicit-any */
  async execute(query: GetByIdEvaluationInstrumentQuery): Promise<IGetByIdEvaluationInstrument | null> {
    const evaluationInstruments = await this.prisma.evaluationInstrument.findUnique({
      where: { id: query.id },
      select: {
        id : true,
        instrumentName : true, periodicity : true, percentage : true,
      }
    });

    return evaluationInstruments;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
