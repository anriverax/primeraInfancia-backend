import { IGroupByUser } from "@/core/group/dto/group.type";
import { Query } from "@nestjs/cqrs";
import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";

export class GetGroupByUserQuery extends Query<IGroupByUser[]> {
  constructor(public readonly responsableId: number) {
    super();
  }
}

@QueryHandler(GetGroupByUserQuery)
export class GetGroupByUserHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetGroupByUserQuery): Promise<IGroupByUser[]> {
    const { responsableId } = query;

    const groupDetail = await this.prisma.mentorAssignment.findMany({
      where: {
        Mentor: {
          Person: {
            User: {
              id: responsableId
            }
          }
        }
      },
      select: {
        Inscription: {
          select: {
            id: true,
            PersonRole: {
              select: {
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
                    },
                    PrincipalSchool: {
                      select: {
                        School: {
                          select: {
                            name: true,
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

    return groupDetail;
  }
}
