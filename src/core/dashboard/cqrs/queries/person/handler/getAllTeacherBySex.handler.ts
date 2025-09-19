import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllTeacherBySexQuery } from "../../person/queries/getAllTeacherBySex.query";

@QueryHandler(GetAllTeacherBySexQuery)
export class GetAllTeacherBySexHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<{ sex: string; count: number }[]> {
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
        sex: item.gender,
        count: item._count._all
      }))
      .sort((a, b) => a.sex.localeCompare(b.sex));
  }
}
