import { IEventInstanceRepository } from "@/core/event/domain/eventInstance.repository.port";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindManyEventInstanceQuery } from "../queries/findMany-eventInstance.query";
import { Inject } from "@nestjs/common";

interface IEventInstanceResponse {
  id: number;
  Event: {
    name: string;
  };
}

@QueryHandler(FindManyEventInstanceQuery)
export class FindManyEventInstanceHandler implements IQueryHandler<FindManyEventInstanceQuery> {
  constructor(
    @Inject("IEventInstanceRepository")
    private readonly eventInstanceRepository: IEventInstanceRepository
  ) {}

  async execute(query: FindManyEventInstanceQuery): Promise<{ id: number; name: string }[] | []> {
    const { userId } = query;

    const eventInstances = await this.eventInstanceRepository.findMany<IEventInstanceResponse>({
      where: {
        Person: {
          User: { id: userId }
        }
      },
      select: {
        id: true,
        Event: { select: { name: true } }
      },
      orderBy: {
        Event: { name: "asc" }
      }
    });

    const formattedEventInstances = eventInstances.map((ei: IEventInstanceResponse) => ({
      id: ei.id,
      name: ei.Event.name
    }));

    return formattedEventInstances;
  }
}
