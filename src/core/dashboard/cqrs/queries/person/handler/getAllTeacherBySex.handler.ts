import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllTeacherBySexQuery } from "../../person/queries/getAllTeacherBySex.query";
import { IGroupCount } from "@/core/dashboard/dto/dashboard.type";

@QueryHandler(GetAllTeacherBySexQuery)
export class GetAllTeacherBySexHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<IGroupCount[]> {
    const teachersByCareer = await this.prisma.person.groupBy({
      by: ["gender"],
      _count: {
        _all: true
      },
      where: {
        PersonRole: {
          some: {
            typePersonId: 2
          }
        }
      }
    });

    return teachersByCareer
      .map((item) => ({
        label: item.gender,
        count: item._count._all
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }
}
