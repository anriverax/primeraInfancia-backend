import { QueryHandler } from "@nestjs/cqrs";
import { GetAllSchoolPaginationQuery } from "./getAllSchoolPagination.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { ISchoolWithPagination } from "../../../dto/school.type";

@QueryHandler(GetAllSchoolPaginationQuery)
export class GetAllSchoolPaginationHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllSchoolPaginationQuery): Promise<ISchoolWithPagination> {
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.school.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          code: true,
          coordenates: true,
          District: {
            select: {
              id: true,
              name: true,
              Municipality: {
                select: {
                  id: true,
                  name: true,
                  Department: {
                    select: {
                      id: true,
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
        },
        orderBy: {
          name: "asc"
        }
      }),

      this.prisma.school.count()
    ]);

    const lastPage = Math.ceil(total / limit);

    const schoolData = data.map((school) => {
      const { District, ...rest } = school;

      return {
        ...rest,
        ubication: `${District.Municipality.Department.name} / ${District.Municipality.name} / ${District.name}`
      };
    });

    return {
      data: schoolData,
      meta: {
        total,
        currentPage: page,
        perPage: limit,
        lastPage,
        prev: page > 1 ? page - 1 : null,
        next: page < lastPage ? page + 1 : null
      }
    };
  }
}
