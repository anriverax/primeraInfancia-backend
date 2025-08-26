import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllTeacherQuery } from "./getAllTeacher.query";

@QueryHandler(GetAllTeacherQuery)
export class GetAllTeacherHandler {
  constructor(private readonly prisma: PrismaService) {}
  /* eslint-disable @typescript-eslint/no-explicit-any*/
  async execute(): Promise<any> {
    const teachers = await this.prisma.school.findMany({
      where: {
        District: {
          Municipality: {
            Department: { id: 1 }
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
                id: true,
                firstName: true
              }
            }
          }
        }
      }
    });

    const teachersData = teachers.map((school) => {
      const teachersData = school.PrincipalSchool.map((ps) => ({
        id: ps.Person.id,
        firstName: ps.Person.firstName
      }));
      return {
        id: school.id,
        name: school.name,
        District: school.District,
        teachers: teachersData
      };
    });

    console.log(teachersData);
    const data = await this.prisma.personRole.findMany({
      where: {
        typePersonId: 5,
        Person: {
          deletedAt: null,
          WorkAssignment: { some: { deletedAt: null, Municipality: { departmentId: 1 } } }
        }
      },
      select: {
        id: true,
        Person: {
          select: {
            id: true,
            WorkAssignment: {
              select: {
                Municipality: {
                  select: { id: true, name: true, Department: { select: { id: true, name: true } } }
                }
              }
            }
          }
        }
      }
    });

    //    let deptCounters = 0;

    console.log(data);
    console.log(teachers.length / data.length);
    return data;
  }
}
