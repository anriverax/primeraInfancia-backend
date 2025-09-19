import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllTeacherByCareerQuery } from "../queries/getAllTeacherByCareer.query";

@QueryHandler(GetAllTeacherByCareerQuery)
export class GetAllTeacherByCareerHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<{ career: string; count: number }[]> {
    const teachersByCareer = await this.prisma.academic.groupBy({
      by: ["career"],
      _count: {
        _all: true
      },
      where: {
        Person: {
          PersonRole: {
            some: {
              typePersonId: 2
            }
          }
        }
      },
      orderBy: {
        _count: {
          id: "desc"
        }
      }
    });

    return teachersByCareer
      .map((item) => ({
        career: item.career,
        count: item._count._all
      }))
      .sort((a, b) => a.career.localeCompare(b.career));
  }
}
