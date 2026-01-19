import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { AttendanceSessionList } from "@/core/attendance/dto/attendance.type";
import { GetAllSessionsBySupportQuery } from "./get-all-sessions-by-support.query";
import { Prisma, RoleType } from "prisma/generated/client";

@QueryHandler(GetAllSessionsBySupportQuery)
export class GetAllSessionsBySupportHandler implements IQueryHandler<GetAllSessionsBySupportQuery> {
  constructor(private readonly prisma: PrismaService) {}
  async execute(query: GetAllSessionsBySupportQuery): Promise<AttendanceSessionList[] | []> {
    let whereClause: Prisma.AttendanceSessionWhereInput = {};

    if (query.role === RoleType.USER_MENTOR) {
      whereClause = {
        createdBy: query.userId
      };
    }

    if (query.role === RoleType.USER_TECNICO_APOYO) {
      whereClause = {
        Support: {
          GroupStaff: {
            some: {
              groupId: {
                equals: query.userId
              }
            }
          }
        }
      };
    }

    const result = await this.prisma.attendanceSession.findMany({
      where: whereClause,
      select: {
        id: true,
        modality: true,
        checkIn: true,
        checkOut: true,
        coordenates: true,
        Support: {
          select: {
            id: true,
            firstName: true,
            lastName1: true,
            lastName2: true
          }
        },
        EventInstance: {
          select: {
            Event: {
              select: {
                name: true
              }
            },
            Person: {
              select: {
                id: true,
                firstName: true,
                lastName1: true,
                lastName2: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 100
    });

    if (result.length === 0) {
      return [];
    }

    // Transform to interface format
    const mapped: AttendanceSessionList[] = result.map((session) => ({
      id: session.id,
      event: session.EventInstance.Event.name,
      checkIn: session.checkIn,
      checkOut: session.checkOut,
      modality: session.modality,
      coordenates: session.coordenates,
      support: {
        id: session.Support.id,
        fullName:
          `${session.Support.firstName} ${session.Support.lastName1} ${session.Support.lastName2 || ""}`.trim()
      },
      responsible: {
        id: session.EventInstance.Person.id,
        fullName:
          `${session.EventInstance.Person.firstName} ${session.EventInstance.Person.lastName1} ${session.EventInstance.Person.lastName2 || ""}`.trim()
      }
    }));

    return mapped;
  }
}
