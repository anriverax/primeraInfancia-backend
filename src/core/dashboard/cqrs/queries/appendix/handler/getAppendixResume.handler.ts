import { QueryHandler } from "@nestjs/cqrs";
import { GetAppendixResumeQuery } from "../queries/getAppendixResume.query";
import { IDashboardResume, CategoryAppendix } from "@/core/dashboard/dto/dashboard.type";
import { PrismaService } from "@/services/prisma/prisma.service";

const TEACHER_TYPE_ID = 2;
const SHIFT_QUESTION_ID = 113;
const EARLY_EDUCATION_QUESTION_ID = 114;
const EXTRA_EDUCATION_QUESTION_ID = 115;

@QueryHandler(GetAppendixResumeQuery)
export class GetAppendixResumeHandler {
  constructor(private prisma: PrismaService) {}

  async execute(query: GetAppendixResumeQuery): Promise<IDashboardResume> {
    console.log(query);

    // By gender and TeacherRole
    const [genderCounts, amShiftGroups, pmShiftGroups, earlyEducationRaw, extraEducationRaw] =
      await Promise.all([
        this.prisma.person.groupBy({
          by: ["gender"],
          _count: { id: true },
          where: {
            PersonRole: {
              some: {
                typePersonId: TEACHER_TYPE_ID
              }
            }
          }
        }),

        // By shift - AM at question 113
        this.prisma.answer.groupBy({
          by: ["inscriptionId"],
          _count: { inscriptionId: true },
          where: {
            questionId: SHIFT_QUESTION_ID,
            valueText: "A.M."
          }
        }),

        // By shift - PM at question 113
        this.prisma.answer.groupBy({
          by: ["inscriptionId"],
          _count: { inscriptionId: true },
          where: {
            questionId: SHIFT_QUESTION_ID,
            valueText: "P.M."
          }
        }),

        // By Early Education
        this.prisma.answer.groupBy({
          by: ["valueText"],
          _count: { valueText: true },
          where: {
            questionId: EARLY_EDUCATION_QUESTION_ID
          }
        }),

        // By Extra Education
        this.prisma.answer.groupBy({
          by: ["valueText"],
          _count: { valueText: true },
          where: {
            questionId: EXTRA_EDUCATION_QUESTION_ID
          }
        })
      ]);

    const amShiftCount = amShiftGroups.length;
    const pmShiftCount = pmShiftGroups.length;
    const teacherMale = genderCounts.find((g) => g.gender === "H")?._count.id || 0;
    const teacherFemale = genderCounts.find((g) => g.gender === "M")?._count.id || 0;
    const earlyEducation: CategoryAppendix[] = earlyEducationRaw.map((item) => ({
      label: item.valueText,
      count: item._count.valueText
    }));
    const extraEducation: CategoryAppendix[] = extraEducationRaw.map((item) => ({
      label: item.valueText,
      count: item._count.valueText
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
