import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllSchoolByDepartmentQuery } from "../queries/getAllSchoolByDepartment.query";

@QueryHandler(GetAllSchoolByDepartmentQuery)
export class GetAllSchoolByDepartmentHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<{ department: string | null; school: number; teacher: number }[] | []> {
    const departmentStats: Record<string, { teacher: number; school: number }> = {};

    const schoolsByDistrict = await this.prisma.school.findMany({
      select: {
        id: true,
        District: {
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
        },
        _count: {
          select: { PrincipalSchool: true }
        }
      }
    });

    for (const school of schoolsByDistrict) {
      const deptName = school.District.Municipality.Department.name;

      if (!departmentStats[deptName]) {
        departmentStats[deptName] = { teacher: 0, school: 0 };
      }

      departmentStats[deptName].teacher += school._count.PrincipalSchool;
      departmentStats[deptName].school += 1;
    }

    const result = Object.entries(departmentStats)
      .map(([department, stats]) => ({
        department,
        teacher: stats.teacher,
        school: stats.school
      }))
      .sort((a, b) => a.department.localeCompare(b.department));

    return result;
  }
}
