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
        },
        PrincipalSchool: {
          select: {
            Person: {
              select: {
                id: true,
                firstName: true,
                lastName1: true,
                lastName2: true,
                phoneNumber: true,
                User: {
                  select: {
                    email: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!school) return null;

    const { PrincipalSchool, ...rest } = school;

    const teachers = PrincipalSchool.map((item) => {
      const { id, phoneNumber, User, ...i } = item.Person;
      return {
        id,
        phoneNumber,
        fullName: `${i.firstName} ${i.lastName1} ${i.lastName2}`,
        email: User?.email!
      };
    });
    return { ...rest, teachers };
  }
}
