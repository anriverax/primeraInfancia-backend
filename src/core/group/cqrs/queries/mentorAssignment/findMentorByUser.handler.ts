import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { FindMentorByUserIdQuery } from "./findMentorByUserId.query";

@QueryHandler(FindMentorByUserIdQuery)
export class FindMentorByUserIdHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: FindMentorByUserIdQuery): Promise<any> {
    const mentorAssignment = await this.prisma.mentorAssignment.findMany({
      where: {
        GroupMentor: {
          PersonRole: {
            Person: {
              User: {
                id: query.id
              }
            }
          }
        }
      },
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
                    firstName: true,
                    lastName1: true,
                    lastName2: true,
                    deletedBy: true,
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
