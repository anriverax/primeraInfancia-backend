import { QueryHandler } from "@nestjs/cqrs";
import { FindLastAttendanceQuery } from "./findLastAttendance.query";
import { PrismaService } from "@/services/prisma/prisma.service";

@QueryHandler(FindLastAttendanceQuery)
export class FindLastAttendanceHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: FindLastAttendanceQuery): Promise<any[]> {
    const { responsableId } = query;

    const attendance = await this.prisma.eventAttendance.findMany({
      where: {
        createdBy: responsableId,
        checkOut: null
      },
      select: {
        checkIn: true,
        coordinates: true,
        AttendanceSession: {
          select: {
            id: true
          }
        },

        Person: {
          select: {
            firstName: true,
            lastName1: true,
            lastName2: true
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
