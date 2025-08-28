import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllTeacherQuery } from "./getAllTeacher.query";
import { ITeacher } from "@/core/group/dto/group.type";

@QueryHandler(GetAllTeacherQuery)
export class GetAllTeacherHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllTeacherQuery): Promise<ITeacher[]> {
    const { departmentId } = query;

    const teachers = await this.prisma.school.findMany({
      where: {
        District: {
          Municipality: {
            Department: { id: departmentId }
          }
        },
        PrincipalSchool: {
          some: {
            deletedAt: null,
            Person: {
              deletedAt: null
            }
          }
        }
      },
      orderBy: {
        District: {
          Municipality: {
            name: "asc"
          }
        }
      },
      select: {
        id: true,
        name: true,
        coordenates: true,
        District: {
          select: {
            id: true,
            name: true,
            Municipality: {
              select: { id: true, name: true, Department: { select: { id: true, name: true } } }
            }
          }
        },
        PrincipalSchool: {
          select: {
            Person: {
              select: {
                id: true
              }
            }
          }
        }
      }
    });

    return teachers;
  }
}
