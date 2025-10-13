import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllEvaluationInstrumentQuery } from "./getAllEvaluationInstrument.query";
import { IGetAllEvaluationInstrument } from "../../../dto/evaluationInstrument.type";

@QueryHandler(GetAllEvaluationInstrumentQuery)
export class GetAllEvaluationInstrumentHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<IGetAllEvaluationInstrument[]> {
    const EvaluationInstruments = await this.prisma.evaluationInstrument.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        periodicity: true,
        percentage: true
      },
      orderBy: {
        name: "asc"
      }
    });

    return EvaluationInstruments;
  }
}
