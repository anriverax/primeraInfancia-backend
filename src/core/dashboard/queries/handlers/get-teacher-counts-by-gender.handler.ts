import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetTeacherCountsByGenderQuery } from "../get-teacher-counts-by-gender.query";

@QueryHandler(GetTeacherCountsByGenderQuery)
export class GetTeacherCountsByGenderHandler implements IQueryHandler<GetTeacherCountsByGenderQuery> {
  constructor(private prisma: PrismaService) {}

  async execute() {
    const schoolsByGender = await this.prisma.person.groupBy({
      by: ["gender"],
      _count: { id: true }
    });

    return schoolsByGender.map((item) => ({
      gender: item.gender,
      count: item._count.id
    }));
  }
}
