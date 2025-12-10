import { PrismaService } from "@/services/prisma/prisma.service";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { EventInstancesHandlerResponse } from "../../dto/event.type";

export class GetAllEventsQuery {
  constructor(public readonly userId: number) {}
}

@QueryHandler(GetAllEventsQuery)
export class GetAllEventsHandler implements IQueryHandler<GetAllEventsQuery> {
  constructor(private readonly prisma: PrismaService) {}
  execute(query: GetAllEventsQuery): Promise<EventInstancesHandlerResponse[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.eventInstance.findMany({
      where: {
        Person: {
          User: {
            id: query.userId
          }
        },
        TrainingModule: {
          startDate: {
            gte: today
          }
        }
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
  }
}
