import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { DepartmentGroupCountResponse } from "../../dto/group.type";

/**
 * Query object representing a request for all Departments (minimal projection).
 * Immutable marker object without properties.
 */
export class GetAllCountDepartmentsQuery {}

/**
 * Handler responsible for fetching all Departments with `id` and `name` fields.
 */
@QueryHandler(GetAllCountDepartmentsQuery)
export class GetAllCountDepartmentHandler implements IQueryHandler<GetAllCountDepartmentsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Executes the query returning a sorted department list.
   * @returns Array of departments ordered ascending by `id`.
   */
  async execute(): Promise<DepartmentGroupCountResponse> {
    // Realizamos tres consultas en paralelo:
    // 1. Departamentos con conteo de grupos (ya filtra deletedAt=null por extensión Prisma)
    // 2. Conteo total de grupos (soft delete aplicado automáticamente)
    // 3. Conteo total de inscripciones (filtramos manualmente deletedAt=null porque Inscription no está en la lista de modelos con soft delete automático)
    const [departments, totalGroups, totalInscriptions] = await Promise.all([
      this.prisma.department.findMany({
        select: {
          id: true,
          name: true,
          _count: { select: { Group: true } }
        },
        orderBy: { id: "asc" }
      }),
      this.prisma.group.count(),
      this.prisma.inscription.count()
    ]);

    return { departments, totalGroups, totalInscriptions };
  }
}
