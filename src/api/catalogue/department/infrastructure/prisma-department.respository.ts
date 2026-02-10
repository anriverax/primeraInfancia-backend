import { Injectable } from "@nestjs/common";
import { IDepartmentRepository } from "../domain/department.repository.port";
import { PrismaService } from "@/services/prisma/prisma.service";
import { ErrorHandlingService } from "@/services/errorHandling/error-handling.service";
import { Prisma } from "prisma/generated/client";
import { PrismaGenericRepository } from "@/common/generic/infrastructure/prisma-generic.repository";

@Injectable()
export class PrismaDepartmentRepository
  extends PrismaGenericRepository<
    Prisma.DepartmentWhereInput,
    Prisma.DepartmentSelect,
    Prisma.DepartmentOrderByWithRelationInput
  >
  implements
    IDepartmentRepository<
      Prisma.DepartmentWhereInput,
      Prisma.DepartmentSelect,
      Prisma.DepartmentOrderByWithRelationInput
    >
{
  protected modelName = "department" as const;
  constructor(prisma: PrismaService, errorHandlingService: ErrorHandlingService) {
    super(prisma, errorHandlingService);
  }
}
