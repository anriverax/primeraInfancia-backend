import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { Department } from "@prisma/client"; // Import User type from Prisma Client

import { PrismaService } from "@/services/prisma/prisma.service";
import { IDepartment } from "../../dto/department.type";

@Injectable({})
export class DepartmentProjection {
  private readonly logger = new Logger("DepartmentProjection");
  constructor(private prisma: PrismaService) {}

  async add(data: IDepartment): Promise<Department> {
    try {
      return await this.prisma.department.create({ data: { ...data, countryId: 3 } });
    } catch (error) {
      this.logger.error(`❌ Error de prisma: `, error);
      throw new BadRequestException("Se ha producido un error al procesar su solicitud.");
    }
  }
}
