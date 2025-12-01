import { QueryHandler } from "@nestjs/cqrs";
import { FindLastAttendanceQuery } from "./findLastAttendance.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IFindLastAttendace } from "@/core/attendance/dto/attendance.type";

@QueryHandler(FindLastAttendanceQuery)
export class FindLastAttendanceHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: FindLastAttendanceQuery): Promise<IFindLastAttendace[]> {
    const { responsableId } = query;

    const attendance = await this.prisma.attendance.findMany({
      where: {
        createdBy: responsableId,
        checkOut: null
      },
      select: {
        checkIn: true,
        coordenates: true,
        modality: true,
        EventInstance: {
          select: {
            id: true
          }
        },
        PersonRole: {
          select: {
            typePersonId: true,
            Person: {
              select: {
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
      }
    });

    return attendance;
  }
}
