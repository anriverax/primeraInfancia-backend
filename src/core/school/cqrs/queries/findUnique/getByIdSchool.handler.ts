import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdSchoolQuery } from "./getByIdSchool.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetSchool } from "@/core/school/dto/school.type";

@QueryHandler(GetByIdSchoolQuery)
export class GetByIdSchoolHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByIdSchoolQuery): Promise<IGetSchool | null> {
    const schools = await this.prisma.school.findUnique({
      where: { id: query.id },
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
        },
        PrincipalSchool:{
          select:{ 
            personId :true,
            Person: {
              select: {
                firstName: true,
                lastName1: true
              }
            }
          }
        },
        _count: {
          select: {
            PrincipalSchool: true
          }
        }
      }
    });

    return schools;
  }
}
