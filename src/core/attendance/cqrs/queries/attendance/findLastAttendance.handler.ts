import { QueryHandler } from "@nestjs/cqrs";
import { FindLastAttendanceQuery } from "./findLastAttendance.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IFindLastAttendace } from "@/core/attendance/dto/attendance.type";

@QueryHandler(FindLastAttendanceQuery)
export class FindLastAttendanceHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: FindLastAttendanceQuery): Promise<IFindLastAttendace | null> {
    const { responsableId } = query;

    const attendance = await this.prisma.attendance.findFirst({
      where: {
        PersonRole: {
          Person: {
            User: {
              id: responsableId
            }
          }
        }
      },
      select: {
        id: true,
        checkIn: true,
        checkOut: true,
        coordenates: true,
        Event: {
          select: {
            name: true
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
