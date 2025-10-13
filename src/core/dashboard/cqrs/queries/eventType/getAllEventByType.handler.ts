import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllEventByTypeQuery } from "./getAllEventByType.query";
// import { IEventType } from "@/core/dashboard/dto/dashboard.type";

@QueryHandler(GetAllEventByTypeQuery)
export class GetAllEventByTypeHandler {
  constructor(private readonly prisma: PrismaService) {}
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  async execute(): Promise<any[]> {
    const events = await this.prisma.attendance.findMany({
      where: {
        checkOut: { not: null }
      },
      select: {
        Event: {
          select: {
            EventType: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    /*
    const result = events
      .map((e) => ({
        ...e,
        totalEvents: e.Event.length
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
*/
    return events;
  }
}
