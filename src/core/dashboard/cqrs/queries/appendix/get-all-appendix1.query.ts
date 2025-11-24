import { GetAllAppendixResponse } from "@/core/dashboard/dto/dashboard.type";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

export class GetAllAppendix1Query {
  constructor(public readonly appendixId: number) {}
}

@QueryHandler(GetAllAppendix1Query)
export class GetAllAppendix1Handler implements IQueryHandler<GetAllAppendix1Query> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<GetAllAppendixResponse[]> {
    const pairs = await this.prisma.surveyData.count({});
    console.log(pairs);
    return await this.prisma.surveyData.findMany({
      where: { appendixId: 1 },
      select: {
        Inscription: {
          select: {
            PersonRole: {
              select: {
                Person: {
                  select: {
                    PrincipalSchool: {
                      select: {
                        School: {
                          select: {
                            id: true,
                            name: true,
                            District: {
                              select: {
                                Municipality: {
                                  select: {
                                    Department: {
                                      select: {
                                        id: true,
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
        }
      },
      // Evita duplicados basados en `inscriptionId` a nivel de BD
      distinct: ["inscriptionId"],
      orderBy: { id: "asc" }
    });
  }
}
