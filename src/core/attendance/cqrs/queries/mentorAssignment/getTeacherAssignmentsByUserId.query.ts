import { ITeachersAssignmentMentor } from "@/core/attendance/dto/attendance.type";
import { Query, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { Prisma, RoleType } from "@prisma/client";

/**
 * Query: GetTeacherAssignmentsByUserIdQuery
 *
 * Returns the list of teacher assignments for the mentor identified by the given user ID.
 *
 * Input
 * - userId: number (the authenticated user's ID)
 *
 * Output
 * - ITeachersAssignmentMentor[] (empty array if none)
 */
export class GetTeacherAssignmentsByUserIdQuery extends Query<ITeachersAssignmentMentor[]> {
  constructor(
    public readonly userId: number,
    public readonly userRole: RoleType
  ) {
    super();
  }
}

/**
 * Handler for GetTeacherAssignmentsByUserIdQuery.
 *
 * Looks up mentor assignments by joining Mentor -> Person -> User using the provided userId.
 */
@QueryHandler(GetTeacherAssignmentsByUserIdQuery)
export class GetTeacherAssignmentsByUserIdHandler {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Executes the query and returns the teacher assignments for the mentor.
   *
   * @param query Query object containing the userId of the authenticated user
   * @returns Array of teacher assignments; empty array if no matches
   */
  async execute(query: GetTeacherAssignmentsByUserIdQuery): Promise<ITeachersAssignmentMentor[]> {
    let where: Prisma.MentorAssignmentWhereInput;

    if (query.userRole === RoleType.USER_FORMADOR) {
      where = {
        TechSupportAssignment: {
          AssignedRole: {
            Person: {
              User: { id: query.userId }
            }
          }
        }
      };
    } else {
      where = {
        Mentor: {
          Person: {
            User: { id: query.userId }
          }
        }
      };
    }

    const mentorAssignment = await this.prisma.mentorAssignment.findMany({
      where,
      select: {
        Inscription: {
          select: {
            deletedBy: true,
            PersonRole: {
              select: {
                id: true,
                deletedBy: true,
                Person: {
                  select: {
                    id: true,
                    deletedBy: true,
                    firstName: true,
                    lastName1: true,
                    lastName2: true,
                    PrincipalSchool: {
                      select: {
                        deletedBy: true,
                        School: {
                          select: {
                            code: true,
                            name: true,
                            coordenates: true,
                            District: {
                              select: {
                                name: true,
                                Municipality: {
                                  select: {
                                    name: true
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!mentorAssignment) return [];

    return mentorAssignment;
  }
}
