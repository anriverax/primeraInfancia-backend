import { GetAspectPracticeCountQuery } from "../queries/getAspectPracticeCount.query";
import { IAspectPracticeCount, AspectPracticeItem } from "@/core/dashboard/dto/dashboard.type";
import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { Prisma } from "@prisma/client";
@QueryHandler(GetAspectPracticeCountQuery)
export class GetAspectPracticeCountHandler {
  constructor(private prisma: PrismaService) {}

  async execute(): Promise<IAspectPracticeCount> {
    // Questions to count inside the survey JSON
    const practiceQuestions = [
      "Conocimiento del desarrollo infantil en la Primera Infancia",
      "Planificación de experiencias de aprendizaje",
      "Atención a la inclusión educativa",
      "Estrategias de juego y exploración",
      "Evaluación de los aprendizajes",
      "Relación con las familias",
      "Gestión del ambiente educativo"
    ];

    // Fetch survey JSONs with appendixId and inscriptionId
    const surveyRows = await this.prisma.surveyData.findMany({
      select: { appendixId: true, inscriptionId: true, survey: true }
    });

    const isJsonArray = (v: Prisma.JsonValue): v is Prisma.JsonArray => Array.isArray(v);
    const isJsonObject = (v: Prisma.JsonValue): v is Prisma.JsonObject =>
      typeof v === "object" && v !== null && !Array.isArray(v);

    // map key: `${appendixId}|${practiceQuestion}` -> set of inscriptionIds
    const hitMap = new Map<string, Set<number>>();

    const scanSurvey = (value: Prisma.JsonValue, appendixId: number, inscriptionId: number): void => {
      if (value == null) return;
      if (typeof value === "string") return;
      if (isJsonArray(value)) {
        for (const el of value) scanSurvey(el, appendixId, inscriptionId);
        return;
      }
      if (isJsonObject(value)) {
        const obj = value as Prisma.JsonObject;

        // Narrow object to survey QA pair { question: string, answer: string }
        const isSurveyQA = (o: Prisma.JsonObject): o is { question: string; answer: string } => {
          const q = o["question"];
          const a = o["answer"];
          return typeof q === "string" && typeof a === "string";
        };

        if (isSurveyQA(obj)) {
          const q = obj.question.trim();
          if (practiceQuestions.includes(q)) {
            const key = `${appendixId}|${q}`;
            const set = hitMap.get(key) ?? new Set<number>();
            set.add(inscriptionId);
            hitMap.set(key, set);
            // don't return; other nested occurrences may exist
          }
        }

        for (const v of Object.values(obj)) scanSurvey(v as Prisma.JsonValue, appendixId, inscriptionId);
      }
    };

    for (const row of surveyRows) {
      scanSurvey(row.survey as Prisma.JsonValue, row.appendixId, row.inscriptionId);
    }

    const items: AspectPracticeItem[] = [];
    for (const [key, set] of hitMap.entries()) {
      const [appendixIdStr, ...qParts] = key.split("|");
      const appendixId = Number(appendixIdStr);
      const practiceAspect = qParts.join("|");
      items.push({ appendixId, practiceAspect, peopleAnswered: set.size });
    }

    // Ensure deterministic ordering by appendixId
    items.sort(
      (a, b) => a.appendixId - b.appendixId || a.practiceAspect.localeCompare(b.practiceAspect)
    );

    return items;
  }
}
