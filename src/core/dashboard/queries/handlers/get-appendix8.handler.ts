import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAppendix8Query } from "../get-appendix8.query";

@QueryHandler(GetAppendix8Query)
export class GetAppendix8Handler implements IQueryHandler<GetAppendix8Query> {
  constructor(private prisma: PrismaService) {}

  /* eslint-disable @typescript-eslint/no-explicit-any */
  async execute(): Promise<any> {
    // Filtrar por 'Anexo 8'
    const records = await this.prisma.answer.findMany({
      where: {
        valueText: "Anexo 8"
      },
      select: {
        questionId: true,
        valueText: true
      }
    });

    const dimensionMap = new Map<string, Map<string, Map<string, number>>>();

    // Procesar 'textQuestion'
    for (const record of records) {
      const parts = record.questionId.toString().split("||");

      if (parts.length >= 2) {
        const time = parts[0];
        const dimension = parts[1];
        const answer = record.valueText;

        if (!dimensionMap.has(dimension)) {
          dimensionMap.set(dimension, new Map());
        }
        const timeMap = dimensionMap.get(dimension);

        if (!timeMap?.has(time)) {
          timeMap?.set(time, new Map());
        }
        const answerMap = timeMap?.get(time);

        answerMap?.set(answer, (answerMap.get(answer) || 0) + 1);
      }
    }

    // Estructura
    const results = {
      dimensionList: Array.from(dimensionMap.entries()).map(([dimension, timeMap]) => {
        const answersData = [{}];
        Array.from(timeMap.entries()).forEach(([time, answerMap]) => {
          Array.from(answerMap.entries()).forEach(([answerLabel, count]) => {
            answersData.push({
              time: Number(time),
              label: answerLabel,
              count: count
            });
          });
        });

        return {
          dimension: dimension,
          answer: answersData
        };
      })
    };
    return results;
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
