import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { Prisma } from "@prisma/client"; // Import User type from Prisma Client

import { PrismaService } from "@/services/prisma/prisma.service";
import { DepartmentCreateInput } from "../../dto/department.type";

/**
 * Projection layer encapsulating data access operations for Department.
 *
 * Notes:
 * - Uses an environment-driven country identifier to scope created departments.
 * - Logs and normalizes persistence errors to HTTP exceptions.
 *
 * Suggestion: consider renaming to `DepartmentRepository` to reflect repository semantics.
 */
@Injectable()
export class DepartmentProjection {
  private readonly logger = new Logger(DepartmentProjection.name);
  /** Default Country ID used when creating departments (from env COUNTRY_ID, defaults to 3). */
  private readonly COUNTRY_ID = parseInt(process.env.COUNTRY_ID ?? "3", 10);

  constructor(private prisma: PrismaService) {}

  /**
   * Inserts a Department into the database.
   * @param data Validated creation input.
   * @returns Object with the generated `id`.
   * @throws BadRequestException When a unique constraint is violated (P2002) or other persistence errors occur.
   * @example
   * // Returns: { id: 10 }
   */
  async add(data: DepartmentCreateInput): Promise<{ id: number }> {
    try {
      return await this.prisma.department.create({
        data: { ...data, countryId: this.COUNTRY_ID },
        select: { id: true }
      });
    } catch (error) {
      this.logger.error(`❌ Prisma error: `, error as Error);
      if ((error as Prisma.PrismaClientKnownRequestError).code === "P2002") {
        throw new BadRequestException("El departamento ya existe.");
      }
      throw new BadRequestException("Se ha producido un error al procesar su solicitud.");
    }
  }
}
