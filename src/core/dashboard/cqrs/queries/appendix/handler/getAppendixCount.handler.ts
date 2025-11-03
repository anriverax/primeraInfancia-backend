import { GetAppendixCountQuery } from "../queries/getAppendixCount.query";
import { IAppendixAnswerCount, AppendixCountItem } from "@/core/dashboard/dto/dashboard.type";
import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
@QueryHandler(GetAppendixCountQuery)
export class GetAppendixCountHandler {
  constructor(private prisma: PrismaService) {}

  async execute(): Promise<IAppendixAnswerCount> {
    const pairs = await this.prisma.surveyData.groupBy({
      by: ["appendixId", "inscriptionId"],
      _count: { _all: true }
    });

    const countPerAppendix = new Map<number, number>();
    for (const p of pairs) {
      const appId = p.appendixId as number;
      countPerAppendix.set(appId, (countPerAppendix.get(appId) || 0) + 1);
    }

    const appendixIds = Array.from(countPerAppendix.keys());
    if (appendixIds.length === 0) return [];

    const appendices = await this.prisma.appendix.findMany({
      where: { id: { in: appendixIds } },
      select: { id: true, title: true }
    });
    const titleById = new Map<number, string>(appendices.map((a) => [a.id, a.title]));

    const result: AppendixCountItem[] = appendixIds
      .sort((a, b) => a - b)
      .map((id) => ({
        appendixId: id,
        appendixTitle: titleById.get(id) ?? String(id),
        peopleAnswered: countPerAppendix.get(id) ?? 0
      }));

    return result;
  }
}
