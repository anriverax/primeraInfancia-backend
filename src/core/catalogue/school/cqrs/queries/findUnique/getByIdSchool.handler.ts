import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetByIdSchoolQuery } from "./getByIdSchool.query";
import { IGetByIdSchool } from "../../../dto/school.type";

@QueryHandler(GetByIdSchoolQuery)
export class GetByIdSchoolHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByIdSchoolQuery): Promise<IGetByIdSchool | null> {
    const school = await this.prisma.school.findUnique({
      where: {
        id: query.id
      },
      select: {
        id: true,
        name: true,
        code: true,
        coordenates: true,
        zone: true,
        sector: true,
        District: {
          select: {
            id: true,
            name: true,
            Municipality: {
              select: {
                id: true,
                name: true,
                Department: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!school) return null;

    return school;
  }
}
