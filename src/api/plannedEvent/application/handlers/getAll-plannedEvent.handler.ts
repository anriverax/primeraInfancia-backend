import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllPlannedEventQuery } from "../queries/getAll-plannedEvent.query";
import { Inject } from "@nestjs/common";
import { IPlannedEventRepository } from "../../domain/ports/plannedEvent.repository.port";
import { IPlannedEventListResponse, IPlannedEventPagination } from "../dto/plannedEvent.type";
import { formatForFrontend } from "@/common/helpers/functions";
import { searchEventColor, shouldHideButton } from "../../domain/utils/plannedEvent.utils";

@QueryHandler(GetAllPlannedEventQuery)
export class GetAllPlannedEventHandler implements IQueryHandler<GetAllPlannedEventQuery> {
  constructor(
    @Inject("IPlannedEventRepository")
    private readonly plannedEventRepository: IPlannedEventRepository
  ) {}

  async execute(query: GetAllPlannedEventQuery): Promise<IPlannedEventPagination> {
    const { userId, meta } = query;
    const { page = 1, limit = 10 } = meta;
    const skip = (page - 1) * limit;

    const [plannedEvents, total] = await Promise.all([
      this.plannedEventRepository.findMany<IPlannedEventListResponse>({
        skip,
        take: limit,
        where: {
          createdBy: userId
        },
        select: {
          id: true,
          start: true,
          description: true,
          TrainingModule: { select: { name: true } },
          EventInstance: { select: { Event: { select: { name: true } } } },
          PlannedEventTeachers: {
            select: {
              deletedAt: true,
              id: true
            }
          }
        },
        orderBy: {
          start: "desc"
        }
      }),
      this.plannedEventRepository.count({
        createdBy: userId,
        deletedAt: null
      })
    ]);

    const formattedPlannedEvents = plannedEvents.map((pe: IPlannedEventListResponse) => {
      const color = searchEventColor(pe.EventInstance.Event.name);
      const plannedEventsTeachersActives = pe.PlannedEventTeachers.filter(
        (pet) => pet.deletedAt === null
      );
      const isHideButton = shouldHideButton(
        pe.EventInstance.Event.name,
        plannedEventsTeachersActives.length
      );

      return {
        id: pe.id,
        start: formatForFrontend(pe.start),
        title: pe.EventInstance.Event.name,
        extendedProps: {
          trainingModule: pe.TrainingModule.name
        },
        isHideButton,
        color
      };
    });

    const lastPage = Math.ceil(total / limit);

    return {
      data: formattedPlannedEvents,
      meta: {
        total,
        currentPage: page,
        perPage: limit,
        lastPage,
        prev: page > 1 ? page - 1 : null,
        next: page < lastPage ? page + 1 : null
      }
    };
  }
}
