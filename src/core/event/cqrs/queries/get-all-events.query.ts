import { PrismaService } from "@/services/prisma/prisma.service";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { EventsHandlerResponse } from "../../dto/event.type";

export class GetAllEventsQuery {
  constructor() {}
}

@QueryHandler(GetAllEventsQuery)
export class GetAllEventsHandler implements IQueryHandler<GetAllEventsQuery> {
  constructor(private readonly prisma: PrismaService) {}
  execute(): Promise<EventsHandlerResponse[]> {
    return this.prisma.event.findMany({
      select: {
        id: true,
        name: true
      }
    });
  }
}
