import { QueryHandler } from "@nestjs/cqrs";
import { GetAppendix8Query } from "../queries/getAppendix8.query";
import { IAppendix8 } from "@/core/dashboard/dto/dashboard.type";
import { PrismaService } from "@/services/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@QueryHandler(GetAppendix8Query)
export class GetAppendix8Handler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<IAppendix8[]> {
    // Fetch survey data for appendix 8
    const rows = await this.prisma.surveyData.findMany({
      where: { appendixId: 7 },
      select: { survey: true }
    });

    const dimensionMap = new Map<string, Map<number, Map<string, number>>>();

    for (const row of rows) {
      const survey = row.survey as Prisma.JsonArray | Prisma.JsonObject | null;
      if (!survey || !Array.isArray(survey)) continue;

      for (const obj of survey) {
        if (!obj || typeof obj !== "object") continue;

        // support multiple possible field names
        const item = obj as Record<string, unknown>;
        const rawQuestion = item["questionText"] ?? item["question"] ?? item["textQuestion"];
        const rawAnswer = item["valueAnswer"] ?? item["answer"] ?? item["textAnswer"];
        const rawIndex = item["index"] ?? item["time"] ?? undefined;

        if (!rawQuestion || !rawAnswer) continue;

        const q = String(rawQuestion).trim();
        const a = String(rawAnswer).trim();

        // If question has '||' format use it: time||dimension||... else try to extract dimension
        let timeNum: number | undefined = undefined;
        let dimension = "";

        if (q.includes("||")) {
          const parts = q.split("||").map((p) => p.trim());
          if (parts.length >= 2) {
            const t = Number(parts[0]);
            timeNum = Number.isNaN(t) ? undefined : t;
            dimension = parts[1];
          }
        }

        if (!dimension) {
          // fallback: use text before ':' as dimension
          if (q.includes(":")) {
            dimension = q.split(":")[0].trim();
          } else {
            // fallback to whole question truncated
            dimension = q.length > 80 ? q.slice(0, 80) + "..." : q;
          }
        }

        if (timeNum === undefined) {
          if (rawIndex !== undefined) {
            const idx = Number(rawIndex);
            timeNum = Number.isNaN(idx) ? 0 : idx;
          } else {
            timeNum = 0;
          }
        }

        // accumulate counts
        if (!dimensionMap.has(dimension)) {
          dimensionMap.set(dimension, new Map<number, Map<string, number>>());
        }
        const timeMap = dimensionMap.get(dimension)!;

        if (!timeMap.has(timeNum)) {
          timeMap.set(timeNum, new Map<string, number>());
        }
        const answerMap = timeMap.get(timeNum)!;

        answerMap.set(a, (answerMap.get(a) ?? 0) + 1);
      }
    }

    const dimensionList: IAppendix8[] = [];

    for (const [dimension, timeMap] of dimensionMap.entries()) {
      const answersByTime = Array.from(timeMap.entries()).map(([time, answerMap]) => ({
        time,
        labels: Array.from(answerMap.entries()).map(([label, count]) => ({ label, count }))
      }));

      answersByTime.sort((a, b) => a.time - b.time);

      dimensionList.push({ dimension, answers: answersByTime });
    }

    return dimensionList;
  }
}
