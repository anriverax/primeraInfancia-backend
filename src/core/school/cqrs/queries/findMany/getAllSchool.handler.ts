import { QueryHandler } from "@nestjs/cqrs";
import { GetAllSchoolQuery } from "./getAllSchool.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetSchool } from "@/core/school/dto/school.type";

@QueryHandler(GetAllSchoolQuery)
export class GetAllSchoolHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<IGetSchool[]> {
    const schools = await this.prisma.school.findMany({
      select: {
        id: true,
        name: true,
        sector: true,
        districtId: true,
        address: true,
        email: true,
        coordenates: true,
        phoneNumber: true,
        District: {
          select: { name: true }
        }
      },
      orderBy: {
        id: "asc"
      }
    });

    return schools;
  }
}
