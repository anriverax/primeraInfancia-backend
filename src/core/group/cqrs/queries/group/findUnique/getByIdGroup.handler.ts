import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetByIdGroupQuery } from "./getByIdGroup.query";
import { IGetByIdGroup } from "@/core/group/dto/group.type";

@QueryHandler(GetByIdGroupQuery)
export class GetByIdGroupHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByIdGroupQuery): Promise<IGetByIdGroup | null> {
    const group = await this.prisma.group.findUnique({
      where: {
        id: query.id
      },
      select: {
        id: true,
        name: true,
        memberCount: true,
        Department: {
          select: {
            name: true
          }
        },
        GroupMentors: {
          where: {
            deletedAt: null,
            deletedBy: null
          },
          select: {
            PersonRole: {
              select: {
                Person: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName1: true,
                    lastName2: true,
                    WorkAssignment: {
                      where: {
                        deletedAt: null,
                        deletedBy: null
                      },
                      select: {
                        Municipality: { select: { name: true } }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        GroupLeader: {
          where: {
            deletedAt: null,
            deletedBy: null
          },
          select: {
            PersonRole: {
              select: {
                id: true,
                Person: { select: { id: true, firstName: true, lastName1: true, lastName2: true } }
              }
            }
          }
        },
        Inscription: {
          select: {
            id: true,
            deletedAt: true,
            PersonRole: {
              select: {
                Person: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName1: true,
                    lastName2: true,
                    phoneNumber: true,
                    User: { select: { email: true, avatar: true } },
                    PrincipalSchool: {
                      select: {
                        School: { select: { name: true } }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        _count: {
          select: { Inscription: true }
        }
      }
    });

    if (!group) return null;

    const { Department, ...rest } = group;

    const newGroup = { ...rest, department: Department.name } as IGetByIdGroup;

    return newGroup;
  }
}
