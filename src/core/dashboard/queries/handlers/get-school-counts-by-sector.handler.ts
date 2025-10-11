import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetSchoolCountsBySectorQuery } from "../get-school-counts-by-sector.query";

@QueryHandler(GetSchoolCountsBySectorQuery)
export class GetSchoolCountsBySectorHandler implements IQueryHandler<GetSchoolCountsBySectorQuery> {
  constructor(private prisma: PrismaService) {}

  async execute(): Promise<{ sector: string | null; count: number }[]> {
    const schoolsBySector = await this.prisma.school.groupBy({
      by: ["zone"],
      _count: { id: true }
    });

    return schoolsBySector.map((item) => ({
      sector: item.zone,
      count: item._count.id
    }));
  }
}
