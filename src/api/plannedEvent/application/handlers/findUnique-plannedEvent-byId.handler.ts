import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { IPlannedEvent, IPlannedEventListResponse } from "../dto/plannedEvent.type";
import { FindUniquePlannedEventByIdQuery } from "../queries/findUnique-plannedEvent-byId.query";
import { IPlannedEventRepository } from "../../domain/ports/plannedEvent.repository.port";
import { PlannedEventDomainService } from "../../domain/services/plannedEventDomain.services";

@QueryHandler(FindUniquePlannedEventByIdQuery)
export class FindUniquePlannedEventByIdHandler implements IQueryHandler<FindUniquePlannedEventByIdQuery> {
  constructor(
    @Inject("IPlannedEventRepository")
    private readonly plannedEventModel: IPlannedEventRepository,
    private readonly plannedEventDomainService: PlannedEventDomainService
  ) {}

  async execute(query: FindUniquePlannedEventByIdQuery): Promise<IPlannedEvent | null> {
    const { id, withTeacher } = query;

    const plannedEvent = await this.plannedEventModel.findUnique<IPlannedEventListResponse>({
      where: {
        id
      },
      select: {
        id: true,
        description: true,
        start: true,
        TrainingModule: {
          select: { id: true, name: true }
        },
        EventInstance: {
          select: {
            id: true,
            Person: { select: { id: true, fullName: true } },
            Event: {
              select: { id: true, name: true }
            }
          }
        },
        PlannedEventTeachers: {
          select: {
            id: true,
            deletedAt: true,
            Teacher: {
              select: {
                id: true,
                deletedAt: true,
                Person: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName1: true,
                    lastName2: true,
                    phoneNumber: true,
                    User: {
                      select: {
                        email: true
                      }
                    }
                  }
                },
                School: {
                  select: {
                    code: true,
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!plannedEvent) {
      return null;
    }

    const formattedPlannedEvents: IPlannedEvent = this.plannedEventDomainService.formattedPlannedEvents(
      withTeacher,
      plannedEvent
    );

    return formattedPlannedEvents;
  }
}
