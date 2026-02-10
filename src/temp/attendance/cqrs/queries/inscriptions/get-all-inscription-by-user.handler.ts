import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllInscriptionByUserQuery } from "./get-all-inscription-by-user.query";

import { PrismaService } from "@/services/prisma/prisma.service";
import {
  GetAllInscriptionResponse,
  GetAllInscriptionResult
} from "@/temp/attendance/dto/attendance.type";

@QueryHandler(GetAllInscriptionByUserQuery)
export class GetAllInscriptionByUserHandler implements IQueryHandler<GetAllInscriptionByUserQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllInscriptionByUserQuery): Promise<GetAllInscriptionResult[]> {
    const { groupStaffId } = query;
    const inscriptions = await this.prisma.teacher.findMany({
      where: {
        groupStaffId: groupStaffId
      },
      select: {
        Person: {
          select: {
            id: true,
            firstName: true,
            lastName1: true,
            lastName2: true,
            deletedAt: true
          }
        },
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
    });
    console.log("Inscriptions:", inscriptions);
    const inscriptionList = inscriptions
      .filter((i) => i.Person !== null && i.Person.deletedAt === null)
      .map((i: GetAllInscriptionResponse) => {
        return {
          ...i,
          Person: {
            ...i.Person,
            School: i.School
          }
        };
      });

    const result: GetAllInscriptionResult[] = inscriptionList.map((i) => {
      return {
        id: i.Person.id,
        fullName: `${i.Person.firstName} ${i.Person.lastName1} ${i.Person.lastName2}`,
        School: {
          code: i.School.code,
          name: i.School.name
        }
      };
    });

    return result;
  }
}
