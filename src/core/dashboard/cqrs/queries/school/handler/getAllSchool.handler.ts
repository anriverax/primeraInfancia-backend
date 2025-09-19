import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllSchoolQuery } from "../queries/getAllSchool.query";

@QueryHandler(GetAllSchoolQuery)
export class GetAllSchoolHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<number> {
    const schools = await this.prisma.school.count();

    return schools;
  }
}
