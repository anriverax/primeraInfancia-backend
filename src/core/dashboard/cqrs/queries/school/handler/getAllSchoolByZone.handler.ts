import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllSchoolByZoneQuery } from "../queries/getAllSchoolByZone.query";
import { IGroupCount } from "@/core/dashboard/dto/dashboard.type";

@QueryHandler(GetAllSchoolByZoneQuery)
export class GetAllSchoolByZoneHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<IGroupCount[]> {
    const schoolsByZone = await this.prisma.school.groupBy({
      by: ["zone"],
      _count: {
        id: true
      }
    });

    return schoolsByZone
      .map((item) => ({
        label: item.zone,
        count: item._count.id
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }
}
