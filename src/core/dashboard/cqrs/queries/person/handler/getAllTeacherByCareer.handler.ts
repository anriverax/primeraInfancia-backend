import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllTeacherByCareerQuery } from "../queries/getAllTeacherByCareer.query";
import { IGroupCount } from "@/core/dashboard/dto/dashboard.type";

@QueryHandler(GetAllTeacherByCareerQuery)
export class GetAllTeacherByCareerHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<IGroupCount[]> {
    const teachersByCareer = await this.prisma.personRole.groupBy({
      by: ["career"],
      _count: {
        _all: true
      },
      where: {
        typePersonId: 2
      },
      orderBy: {
        _count: {
          id: "desc"
        }
      }
    });

    return teachersByCareer
      .map((item) => ({
        label: item.career,
        count: item._count._all
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }
}
