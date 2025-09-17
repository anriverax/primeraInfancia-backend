import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetSchoolCountsByZoneQuery } from "../get-school-counts-by-zone.query";

@QueryHandler(GetSchoolCountsByZoneQuery)
export class GetSchoolCountsByZoneHandler implements IQueryHandler<GetSchoolCountsByZoneQuery> {
  constructor(private prisma: PrismaService) {}

  //async execute(query: GetSchoolCountsByZoneQuery) {
  async execute() {
    const schoolsByZone = await this.prisma.school.groupBy({
      by: ["zone"],
      _count: { id: true }
    });

    return schoolsByZone.map((item) => ({
      zone: item.zone,
      count: item._count.id
    }));
  }
}
