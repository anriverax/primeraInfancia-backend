import { PrismaService } from "@/services/prisma/prisma.service";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllEventResponse, GetAllEventResult } from "../../../dto/attendance.type";
import { GetAllEventsByUserQuery } from "./get-all-events-by-user.handler";

@QueryHandler(GetAllEventsByUserQuery)
export class GetAllEventsByUserHandler implements IQueryHandler<GetAllEventsByUserQuery> {
  constructor(private readonly prisma: PrismaService) {}
  async execute(query: GetAllEventsByUserQuery): Promise<GetAllEventResult[]> {
    const events = await this.prisma.eventInstance.findMany({
      where: {
        responsibleId: query.responsible
      },
      select: {
        id: true,
        Event: {
          select: {
            name: true
          }
        }
      }
    });

    const eventList = events.map((e: GetAllEventResponse) => ({
      id: e.id,
      name: e.Event.name
    }));

    return eventList.sort((a, b) => a.name.localeCompare(b.name));
  }
}
