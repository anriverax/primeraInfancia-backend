import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAppendix8Query } from "../queries/getAppendix8.query";
import { IAppendix8 } from "@/core/dashboard/dto/dashboard.type";

@QueryHandler(GetAppendix8Query)
export class GetAppendix8Handler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<IAppendix8[]> {
    const records = await this.prisma.appendixTest.findMany({
      where: {
        name: "Anexo 8"
      },
      select: {
        textQuestion: true,
        textAnswer: true
      }
    });

    const dimensionMap = new Map<string, Map<string, Map<string, number>>>();

    // Procesar 'textQuestion'
    for (const record of records) {
      const parts = record.textQuestion.split("||");

      if (parts.length >= 2) {
        const time = parts[0];
        const dimension = parts[1];
        const answer = record.textAnswer;

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
    const dimensionList = Array.from(dimensionMap.entries()).map(([dimension, timeMap]) => {
      const answersByTime: { time: number; labels: { label: string; count: number }[] }[] = [];

      Array.from(timeMap.entries()).forEach(([time, answerMap]) => {
        const labels: { label: string; count: number }[] = [];

        Array.from(answerMap.entries()).forEach(([answerLabel, count]) => {
          labels.push({ label: answerLabel, count });
        });

        answersByTime.push({
          time: Number(time),
          labels
        });
      });

      return {
        dimension,
        answers: answersByTime
      };
    });

    return dimensionList;
  }
}
