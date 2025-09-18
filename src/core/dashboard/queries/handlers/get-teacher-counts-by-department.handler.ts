import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetTeacherCountsByDepartmentQuery } from "../get-teacher-counts-by-department.query";

@QueryHandler(GetTeacherCountsByDepartmentQuery)
export class GetTeacherCountByDepartmentHandler
  implements IQueryHandler<GetTeacherCountsByDepartmentQuery> {
  constructor(private prisma: PrismaService) { }

  async execute() {
    const teachersByDepartment = await this.prisma.person.groupBy({
      by: ["districtId"], // Group by districtId first for the join
      _count: {
        id: true
      },
      where: {
        PersonRole: {
          some: {
            typePersonId: 2 // Filter for teachers
          }
        }
      }
    });

    // Post-process the result to get department names
    const departmentCounts = {};
    for (const item of teachersByDepartment) {
      const district = await this.prisma.district.findUnique({
        where: {
          id: item.districtId
        },
        select: {
          Municipality: {
            select: {
              Department: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });

      const departmentName = district?.Municipality?.Department?.name;
      if (departmentName) {
        departmentCounts[departmentName] = (departmentCounts[departmentName] || 0) + item._count.id;
      }
    }

    // Convert the object to an array of objects
    const result = Object.entries(departmentCounts).map(([name, count]) => ({
      department: name,
      teacherCount: count
    }));

    return result;
  }
}
