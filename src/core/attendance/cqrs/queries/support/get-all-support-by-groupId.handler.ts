import { PrismaService } from "@/services/prisma/prisma.service";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllSupportByGroupIdQuery } from "./get-all-support-by-groupId.query";
import { GetAllSupportResponse, GetAllSupportResult } from "@/core/attendance/dto/attendance.type";

@QueryHandler(GetAllSupportByGroupIdQuery)
export class GetAllSupportByGroupIdHandler implements IQueryHandler<GetAllSupportByGroupIdQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllSupportByGroupIdQuery): Promise<GetAllSupportResult[]> {
    const { groupId, userId } = query;

    const getSupport = await this.prisma.groupStaff.findMany({
      where: {
        groupId,
        Person: {
          User: {
            id: { not: userId }
          },
          typePersonId: { in: [4, 5] } // "FORMADOR" - "MENTOR"
        }
      },
      select: {
        Person: {
          select: {
            id: true,
            firstName: true,
            lastName1: true,
            lastName2: true
          }
        }
      },
      orderBy: {
        Person: {
          firstName: "asc"
        }
      }
    });

    const supportList = getSupport.map((support: GetAllSupportResponse) => ({
      id: support.Person.id,
      fullName:
        `${support.Person.firstName} ${support.Person.lastName1}${support.Person.lastName2 ? " " + support.Person.lastName2 : ""}`.trim()
    }));

    return supportList;
  }
}
