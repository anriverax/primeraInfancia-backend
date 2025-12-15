import { IMentors } from "@/core/attendance/dto/attendance.type";
import { PrismaService } from "@/services/prisma/prisma.service";
import { Query, QueryHandler } from "@nestjs/cqrs";

/**
 * Query: GetMentorsAssignedToUserQuery
 *
 * Returns the list of mentors assigned to the given user (tech support assignment).
 *
 * Input
 * - userId: number (authenticated user id)
 *
 * Output
 * - IMentors[] (empty array if none)
 */
export class GetMentorsAssignedToUserQuery extends Query<IMentors[]> {
  constructor(public readonly userId: number) {
    super();
  }
}

/**
 * Handler for GetMentorsAssignedToUserQuery.
 *
 * Note: Despite historical naming mentioning "events", this query returns mentors
 * assigned to the provided userId. If events need to be included later, expand the
 * select accordingly.
 */
@QueryHandler(GetMentorsAssignedToUserQuery)
export class GetMentorsAssignedToUserHandler {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Executes the query and returns distinct mentors assigned to the user.
   *
   * @param query Query with userId
   * @returns Array of mentors assigned to the user
   */
  async execute(query: GetMentorsAssignedToUserQuery): Promise<IMentors[]> {
    const { userId } = query;

    const mentors = await this.prisma.mentorAssignment.findMany({
      where: {
        TechSupportAssignment: {
          TechSupport: {
            Person: {
              User: {
                id: userId
              }
            }
          }
        }
      },
      select: {
        Mentor: {
          select: {
            id: true,
            deletedBy: true,
            Person: {
              select: {
                deletedBy: true,
                firstName: true,
                lastName1: true,
                lastName2: true
              }
            }
          }
        }
      },
      distinct: ["mentorId"]
    });

    return mentors;
  }
}
