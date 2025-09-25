import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllEventByTypeQuery } from "./getAllEventByType.query";
import { IEventType } from "@/core/dashboard/dto/dashboard.type";

@QueryHandler(GetAllEventByTypeQuery)
export class GetAllEventByTypeHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<IEventType[]> {
    const events = await this.prisma.eventType.findMany({
      select: {
        name: true,
        Event: {
          select: {
            name: true
          }
        }
      }
    });

    const result = events
      .map((e) => ({
        ...e,
        totalEvents: e.Event.length
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }
}
