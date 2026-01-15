import { IQueryHandler, QueryHandler, Query } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { AnswerData, AppendixDetail, AnswerDetail } from "@/core/appendix/dto/answerData.dto";

export class GetAnswerDataByInscriptionQuery extends Query<AnswerData> {
  constructor(public readonly inscriptionId: number) {
    super();
  }
}

@QueryHandler(GetAnswerDataByInscriptionQuery)
export class GetAnswerDataByInscriptionHandler
  implements IQueryHandler<GetAnswerDataByInscriptionQuery, AnswerData>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAnswerDataByInscriptionQuery): Promise<AnswerData> {
    const { inscriptionId } = query;

    const ins = await this.prisma.inscription.findUnique({
      where: { id: inscriptionId },
      select: {
        PersonRole: {
          select: { Person: { select: { firstName: true, lastName1: true, lastName2: true } } }
        }
      }
    });

    const person = ins?.PersonRole?.Person;
    const fullName = person ? `${person.firstName} ${person.lastName1}` : "";

    // load all appendices (to include those with zero tries)
    const allAppendices = await this.prisma.appendix.findMany({
      select: { id: true, title: true },
      orderBy: { id: "asc" }
    });

    // Fetch answers with basic fields (no relation includes)
    const rawAnswers = await this.prisma.answer.findMany({
      where: { inscriptionId, deletedAt: null },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        valueText: true,
        questionId: true,
        appendixId: true,
        createdAt: true
      }
    });

    type RawAnswer = {
      id: number;
      valueText: string;
      questionId: number;
      appendixId: number;
      createdAt: Date | null;
    };

    const perAppendixDate = new Map<number, Map<string, AnswerDetail[]>>();

    if (rawAnswers.length > 0) {
      const questionIds = Array.from(new Set(rawAnswers.map((r) => r.questionId)));
      const questions = await this.prisma.question.findMany({
        where: { id: { in: questionIds } },
        select: { id: true, text: true, sectionId: true }
      });

      const sectionIds = Array.from(new Set(questions.map((q) => q.sectionId)));
      const sections = await this.prisma.section.findMany({
        where: { id: { in: sectionIds } },
        select: { id: true, appendixId: true }
      });

      const questionById = new Map<number, { id: number; text: string; sectionId: number }>(
        questions.map((q) => [q.id, q])
      );
      const sectionById = new Map<number, { id: number; appendixId: number }>(
        sections.map((s) => [s.id, s])
      );

      for (const a of rawAnswers as RawAnswer[]) {
        const q = questionById.get(a.questionId);
        const section = q ? sectionById.get(q.sectionId) : undefined;
        const appId = section ? section.appendixId : a.appendixId;

        const dateKey = a.createdAt ? a.createdAt.toISOString().slice(0, 10) : "unknown";
        const detail: AnswerDetail = {
          questionId: a.questionId,
          questionText: q ? q.text : "",
          answerText: a.valueText
        };

        if (!perAppendixDate.has(appId)) perAppendixDate.set(appId, new Map());
        const dateMap = perAppendixDate.get(appId)!;
        if (!dateMap.has(dateKey)) dateMap.set(dateKey, []);
        dateMap.get(dateKey)!.push(detail);
      }
    }

    // build summary and details
    const appendixSummary = allAppendices.map((ap) => ({
      appendixId: ap.id,
      appnedixName: ap.title,
      numberOfTries: perAppendixDate.get(ap.id)?.size ?? 0
    }));

    const appendixDetails: AppendixDetail[] = [];
    for (const ap of allAppendices) {
      const dateMap = perAppendixDate.get(ap.id);
      if (!dateMap || dateMap.size === 0) {
        appendixDetails.push({ appendixId: ap.id, dateCompleted: "N/A", answersDetails: null });
        continue;
      }

      for (const [date, answers] of dateMap.entries()) {
        appendixDetails.push({ appendixId: ap.id, dateCompleted: date, answersDetails: answers });
      }
    }

    const result: AnswerData = {
      inscriptionId,
      fullName,
      appendixSummary,
      appendixDetails
    };

    return result;
  }
}
