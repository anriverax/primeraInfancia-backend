import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGroupByUser } from "@/core/group/dto/group.type";
import { GetGroupByUserQuery } from "./getGroupByUser.query";

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
