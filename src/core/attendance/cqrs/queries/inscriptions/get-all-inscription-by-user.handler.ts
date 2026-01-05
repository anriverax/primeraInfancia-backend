import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllInscriptionByUserQuery } from "./get-all-inscription-by-user.query";
import {
  GetAllInscriptionResponse,
  GetAllInscriptionResult
} from "@/core/attendance/dto/attendance.type";
import { PrismaService } from "@/services/prisma/prisma.service";

@QueryHandler(GetAllInscriptionByUserQuery)
export class GetAllInscriptionByUserHandler implements IQueryHandler<GetAllInscriptionByUserQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllInscriptionByUserQuery): Promise<GetAllInscriptionResult[]> {
    const { groupStaffId, groupId } = query;
    const inscriptions = await this.prisma.inscription.findMany({
      where: {
        groupId,
        mentorId: groupStaffId
      },
      select: {
        Person: {
          select: {
            id: true,
            firstName: true,
            lastName1: true,
            lastName2: true,
            deletedAt: true,
            PrincipalSchool: {
              select: {
                deletedAt: true,
                School: {
                  select: {
                    code: true,
                    name: true,
                    coordenates: true,
                    District: {
                      select: {
                        name: true,
                        Municipality: {
                          select: {
                            name: true
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const inscriptionList = inscriptions
      .filter((i) => i.Person !== null && i.Person.deletedAt === null)
      .map((i: GetAllInscriptionResponse) => {
        const principalSchool = i.Person.PrincipalSchool.filter((p) => p.deletedAt === null);

        return {
          ...i,
          Person: {
            ...i.Person,
            PrincipalSchool: principalSchool
          }
        };
      })
      .filter((i) => i.Person.PrincipalSchool.length > 0);

    const result: GetAllInscriptionResult[] = inscriptionList.map((i) => {
      const school = i.Person.PrincipalSchool[0].School;

      return {
        id: i.Person.id,
        fullName: `${i.Person.firstName} ${i.Person.lastName1} ${i.Person.lastName2}`,
        School: {
          code: school.code,
          name: school.name
        }
      };
    });
    return result;
  }
}
