import { QueryHandler } from "@nestjs/cqrs";
import { FindLastAttendanceQuery } from "./find-lastAttendance.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { FindLastAttendanceResult, FindLastEventResponse } from "@/core/attendance/dto/attendance.type";

@QueryHandler(FindLastAttendanceQuery)
export class FindLastAttendanceHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: FindLastAttendanceQuery): Promise<FindLastAttendanceResult | null> {
    const { responsableId } = query;

    const attendance = await this.prisma.attendanceSession.findFirst({
      where: {
        checkOut: null,
        OR: [{ Support: { id: responsableId } }, { EventInstance: { id: responsableId } }]
      },
      select: {
        id: true,
        modality: true,
        checkIn: true,
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
            id: true,
            Event: {
              select: {
                name: true
              }
            },
            Person: {
              select: {
                firstName: true,
                lastName1: true,
                lastName2: true
              }
            }
          }
        },
        EventAttendance: {
          select: {
            id: true,
            Person: {
              select: {
                id: true,
                firstName: true,
                lastName1: true,
                lastName2: true
              }
            },
            checkIn: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    if (!attendance) return null;

    const { Support, EventInstance, EventAttendance, ...rest } = attendance;

    const attendanceFormatted = {
      ...rest,
      eventInstance: {
        id: EventInstance.id,
        name: EventInstance.Event.name,
        responsible:
          `${EventInstance.Person.firstName} ${EventInstance.Person.lastName1}${EventInstance.Person.lastName2 ? " " + EventInstance.Person.lastName2 : ""}`.trim()
      },
      support: {
        id: Support.id,
        fullName:
          `${Support.firstName} ${Support.lastName1}${Support.lastName2 ? " " + Support.lastName2 : ""}`.trim()
      }
    };

    const attendanceEventsFormatted = EventAttendance.map((event: FindLastEventResponse) => ({
      id: event.id,
      checkIn: event.checkIn,
      status: event.status,
      teacher: {
        id: event.Person.id,
        fullName: `${event.Person.firstName} ${event.Person.lastName1}${
          event.Person.lastName2 ? " " + event.Person.lastName2 : ""
        }`.trim()
      }
    }));

    return { ...attendanceFormatted, teacherSession: attendanceEventsFormatted };
  }
}
