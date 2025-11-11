import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { DepartmentList } from "../../dto/department.type";

/**
 * Query object representing a request for all Departments (minimal projection).
 * Immutable marker object without properties.
 */
export class GetAllDepartmentsQuery {}

/**
 * Handler responsible for fetching all Departments with `id` and `name` fields.
 */
@QueryHandler(GetAllDepartmentsQuery)
export class GetAllDepartmentHandler implements IQueryHandler<GetAllDepartmentsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Executes the query returning a sorted department list.
   * @returns Array of departments ordered ascending by `id`.
   */
  async execute(): Promise<DepartmentList[]> {
    return await this.prisma.department.findMany({
      select: {
        id: true,
        name: true
      },
      orderBy: {
        id: "asc"
      }
    });
  }
}
