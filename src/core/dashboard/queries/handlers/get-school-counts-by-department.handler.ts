import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetSchoolCountsByDepartmentQuery } from "../get-school-counts-by-department.query";

@QueryHandler(GetSchoolCountsByDepartmentQuery)
export class GetSchoolCountsByDepartmentHandler
  implements IQueryHandler<GetSchoolCountsByDepartmentQuery>
{
  constructor(private prisma: PrismaService) {}

  async execute(): Promise<{ department: string | null; schoolCount: number }[]> {
    const schoolsByDistrict = await this.prisma.school.groupBy({
      by: ["districtId"],
      _count: {
        id: true
      }
    });

    const departmentCounts = {};

    for (const item of schoolsByDistrict) {
      // Find the department name for the current districtId
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
        // Add the count to the corresponding department
        departmentCounts[departmentName] = (departmentCounts[departmentName] || 0) + item._count.id;
      }
    }

    // Format the final result into an array of objects
    const result = Object.entries(departmentCounts).map(([name, count]) => ({
      department: name,
      schoolCount: count
    }));

    return result;
  }
}
