import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllMentoringQuery } from "./getAllMentoring.query";
import { IGroupCount } from "@/core/dashboard/dto/dashboard.type";
import { AttendanceEnum } from "@prisma/client";

@QueryHandler(GetAllMentoringQuery)
export class GetAllMentoringHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllMentoringQuery): Promise<IGroupCount[]> {
    const { status } = query;
    const mentoring = await this.prisma.attendance.groupBy({
      by: ["eventId"],
      _count: { _all: true },
      where: {
        status: status as AttendanceEnum,
        PersonRole: {
          deletedAt: null,
          deletedBy: null,
          typePersonId: 2
        },
        Event: {
          EventType: {
            id: 2
          }
        }
      }
    });

    const result = await Promise.all(
      mentoring.map(async (a) => {
        const event = await this.prisma.event.findUnique({
          where: { id: a.eventId },
          select: {
            name: true
          }
        });

        return {
          label: event?.name,
          count: a._count._all
        };
      })
    );

    const data = result.filter((r) => r.label !== null) as { label: string; count: number }[];

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

    return grouped;
  }
}
