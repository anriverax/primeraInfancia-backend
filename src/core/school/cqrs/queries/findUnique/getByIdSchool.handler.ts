import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdSchoolQuery } from "./getByIdSchool.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetSchool } from "@/core/school/dto/school.type";

@QueryHandler(GetByIdSchoolQuery)
export class GetByIdSchoolHandler {
  constructor(private readonly prisma: PrismaService) { }

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
        PrincipalSchool: {
          select: {
            personId: true,
            Person: {
              select: {
                id: true,
                firstName: true,
                lastName1: true,
                lastName2: true,
                dui: true,
                address: true,
                gender: true,
                phoneNumber: true,
                birthdate: true,
                duiImage: true,
                isActive: true,
                User: {
                  select: {
                    email: true
                  }
                },
                TypePerson: {
                  select: { name: true }
                }
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
