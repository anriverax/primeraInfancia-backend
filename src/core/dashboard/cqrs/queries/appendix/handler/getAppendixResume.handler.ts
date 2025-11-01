import { QueryHandler } from "@nestjs/cqrs";
import { GetAppendixResumeQuery } from "../queries/getAppendixResume.query";
import { IDashboardResume, CategoryAppendix } from "@/core/dashboard/dto/dashboard.type";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllTeacherBySexHandler } from "@/core/dashboard/cqrs/queries/person/handler/getAllTeacherBySex.handler";
import { Prisma } from "@prisma/client";

@QueryHandler(GetAppendixResumeQuery)
export class GetAppendixResumeHandler {
  constructor(private prisma: PrismaService) {}

  async execute(): Promise<IDashboardResume> {
    // Reuse existing handler to obtain teachers grouped by sex
    const genderCounts = await new GetAllTeacherBySexHandler(this.prisma).execute();

    // Fetch survey JSONs (inscriptionId + survey) via Prisma client
    const surveyRows = (await this.prisma.surveyData.findMany({
      select: { inscriptionId: true, survey: true }
    })) as Array<{
      inscriptionId: number;
      survey: Prisma.JsonValue | null;
    }>;

    // Helpers and types
    type ShiftFlags = { inscriptionId: number; has_am: boolean; has_pm: boolean };

    const isJsonArray = (v: Prisma.JsonValue | null | undefined): v is Prisma.JsonArray =>
      Array.isArray(v);
    const isJsonObject = (v: Prisma.JsonValue | null | undefined): v is Prisma.JsonObject =>
      typeof v === "object" && v !== null && !Array.isArray(v);

    const scanForAmPm = (
      value: Prisma.JsonValue | null | undefined
    ): { foundAm: boolean; foundPm: boolean } => {
      let foundAm = false;
      let foundPm = false;

      const scan = (v: Prisma.JsonValue | null | undefined): void => {
        if (v == null) return;
        if (typeof v === "string") {
          const clean = v.toLowerCase().replace(/\./g, "").trim();
          if (clean.includes("am")) foundAm = true;
          if (clean.includes("pm")) foundPm = true;
          return;
        }
        if (isJsonArray(v)) {
          for (const it of v) {
            if (foundAm && foundPm) break;
            scan(it);
          }
          return;
        }
        if (isJsonObject(v)) {
          for (const it of Object.values(v)) {
            if (foundAm && foundPm) break;
            scan(it as Prisma.JsonValue);
          }
        }
      };

      scan(value);
      return { foundAm, foundPm };
    };

    // Build shift flags per inscription
    const shiftMap = new Map<number, ShiftFlags>();
    for (const row of surveyRows) {
      const insId = row.inscriptionId;
      const { foundAm, foundPm } = scanForAmPm(row.survey);
      const existing = shiftMap.get(insId) ?? { inscriptionId: insId, has_am: false, has_pm: false };
      existing.has_am = existing.has_am || foundAm;
      existing.has_pm = existing.has_pm || foundPm;
      shiftMap.set(insId, existing);
    }

    const shiftPerInscription = Array.from(shiftMap.values());
    const amShiftCount = shiftPerInscription.filter((r) => r.has_am).length;
    const pmShiftCount = shiftPerInscription.filter((r) => r.has_pm).length;

    // teacher counts (handler returns { label, count }[])
    const teacherMale = genderCounts.find((g) => g.label === "H")?.count || 0;
    const teacherFemale = genderCounts.find((g) => g.label === "M")?.count || 0;

    // Early education: question text match
    const EARLY_EDUCATION_QUESTION_TEXT = "¿Cuál es su formación inicial?";
    const earlyMap = new Map<string, number>();

    const collectEarly = (survey: Prisma.JsonValue | null | undefined): void => {
      if (survey == null) return;
      if (isJsonArray(survey)) {
        for (const el of survey) {
          if (el == null) continue;
          if (typeof el === "object" && el !== null) {
            const rec = el as Record<string, unknown>;
            if ("question" in rec && "answer" in rec) {
              const q = rec.question;
              const a = rec.answer;
              if (typeof q === "string" && q.trim() === EARLY_EDUCATION_QUESTION_TEXT) {
                const ans = String(a ?? "").trim();
                if (ans.length) earlyMap.set(ans, (earlyMap.get(ans) || 0) + 1);
                continue;
              }
            }
          }
          collectEarly(el as Prisma.JsonValue);
        }
      } else if (isJsonObject(survey)) {
        for (const v of Object.values(survey)) collectEarly(v as Prisma.JsonValue);
      }
    };

    for (const row of surveyRows) collectEarly(row.survey);
    const earlyEducation: CategoryAppendix[] = Array.from(earlyMap.entries()).map(([label, count]) => ({
      label,
      count
    }));

    // Extra education: question text variants
    const EXTRA_EDUCATION_QUESTION_TEXTS = [
      "¿Cuenta con estudios de posgrado u otra formación complementaria?",
      "¿Cuenta con estudios de posgrado y otra formación complementaria?"
    ];
    const extraMap = new Map<string, number>();

    const collectExtra = (survey: Prisma.JsonValue | null | undefined): void => {
      if (survey == null) return;
      if (isJsonArray(survey)) {
        for (const el of survey) {
          if (el == null) continue;
          if (typeof el === "object" && el !== null) {
            const rec = el as Record<string, unknown>;
            if ("question" in rec && "answer" in rec) {
              const qv = rec.question;
              const av = rec.answer;
              const q = typeof qv === "string" ? qv.trim() : String(qv ?? "");
              const qLower = q.toLowerCase();
              const isMatch =
                EXTRA_EDUCATION_QUESTION_TEXTS.includes(q) ||
                (qLower.includes("posgrado") && qLower.includes("formacion"));
              if (isMatch) {
                const ans = String(av ?? "").trim();
                if (ans.length) extraMap.set(ans, (extraMap.get(ans) || 0) + 1);
                continue;
              }
            }
          }
          collectExtra(el as Prisma.JsonValue);
        }
      } else if (isJsonObject(survey)) {
        for (const v of Object.values(survey)) collectExtra(v as Prisma.JsonValue);
      }
    };

    for (const row of surveyRows) collectExtra(row.survey);
    const extraEducation: CategoryAppendix[] = Array.from(extraMap.entries()).map(([label, count]) => ({
      label,
      count
    }));

    return {
      teacherMale,
      teacherFemale,
      teacherShiftAm: amShiftCount,
      teacherShiftPm: pmShiftCount,
      earlyEducation,
      extraEducation
    };
  }
}
