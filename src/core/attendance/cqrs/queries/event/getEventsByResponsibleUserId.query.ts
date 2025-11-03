import { IGetAllEvent } from "@/core/attendance/dto/attendance.type";
import { Query, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";

/**
 * Query: GetEventsByResponsibleUserIdQuery
 *
 * Returns the list of events where the given user (by userId) is the responsible.
 *
 * Input
 * - responsibleUserId: number (authenticated user id)
 *
 */
export class GetEventsByResponsibleUserIdQuery extends Query<IGetAllEvent[]> {
  constructor(public readonly responsibleUserId: number) {
    super();
  }
}

/**
 * Handler for GetEventsByResponsibleUserIdQuery.
 */
@QueryHandler(GetEventsByResponsibleUserIdQuery)
export class GetEventsByResponsibleUserIdHandler {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Executes the query to fetch events where the user is responsible.
   *
   * @param query Query with the responsibleUserId
   * @returns Array of events ordered by id ascending
   */
  async execute(query: GetEventsByResponsibleUserIdQuery): Promise<IGetAllEvent[]> {
    const { responsibleUserId } = query;

    const events = await this.prisma.event.findMany({
      where: {
        PersonRole: {
          Person: {
            User: {
              id: responsibleUserId
            }
          }
        }
      },
      select: {
        id: true,
        name: true
      },
      orderBy: {
        id: "asc"
      }
    });

    return events;
  }
}
