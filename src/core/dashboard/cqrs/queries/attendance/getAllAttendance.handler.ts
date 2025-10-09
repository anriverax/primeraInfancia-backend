import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllAttendanceQuery } from "./getAllAttendance.query";
import { IGroupCount } from "@/core/dashboard/dto/dashboard.type";

@QueryHandler(GetAllAttendanceQuery)
export class GetAllAttendanceHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllAttendanceQuery): Promise<IGroupCount[]> {
    console.log(query);
    const attendances = await this.prisma.attendance.groupBy({
      by: ["eventId"],
      where: {
        status: "PRESENTE",
        Event: {
          eventTypeId: { in: [2, 3, 4] }
        },
        PersonRole: {
          deletedAt: null,
          deletedBy: null,
          typePersonId: 2
        }
      },
      _count: { _all: true }
    });

    const result = await Promise.all(
      attendances.map(async (a) => {
        const event = await this.prisma.event.findUnique({
          where: { id: a.eventId },
          select: {
            EventType: {
              select: { id: true, name: true }
            }
          }
        });

        return {
          label: event?.EventType.name,
          count: a._count._all
        };
      })
    );

    const data = result.filter((r) => r.label !== null) as { label: string; count: number }[];
    console.log(data);
    const grouped = Object.values(
      data.reduce(
        (acc, item) => {
          if (!acc[item.label]) {
            acc[item.label] = { label: item.label, count: 0 };
          }
          acc[item.label].count += item.count;
          return acc;
        },
        {} as Record<string, { label: string; count: number }>
      )
    );
    console.log(grouped);
    return grouped;
  }
}
