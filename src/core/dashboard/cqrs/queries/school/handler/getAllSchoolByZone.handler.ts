import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllSchoolByZoneQuery } from "../queries/getAllSchoolByZone.query";

@QueryHandler(GetAllSchoolByZoneQuery)
export class GetAllSchoolByZoneHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<{ name: string | null; count: number }[]> {
    const schoolsByZone = await this.prisma.school.groupBy({
      by: ["zone"],
      _count: {
        id: true
      }
    });

    return schoolsByZone
      .map((item) => ({
        name: item.zone,
        count: item._count.id
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
