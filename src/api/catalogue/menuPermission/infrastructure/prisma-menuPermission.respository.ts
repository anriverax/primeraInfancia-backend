import { Injectable } from "@nestjs/common";
import { IMenuPermissionRepository } from "../domain/menuPermission.repository.port";
import { PrismaService } from "@/services/prisma/prisma.service";
import { ErrorHandlingService } from "@/services/errorHandling/error-handling.service";
import { PrismaGenericRepository } from "@/common/generic/infrastructure/prisma-generic.repository";
import { Prisma } from "prisma/generated/client";

@Injectable()
export class PrismaMenuPermissionRepository
  extends PrismaGenericRepository<
    Prisma.MenuPermissionWhereInput,
    Prisma.MenuPermissionSelect,
    Prisma.MenuPermissionOrderByWithRelationInput
  >
  implements
    IMenuPermissionRepository<
      Prisma.MenuPermissionWhereInput,
      Prisma.MenuPermissionSelect,
      Prisma.MenuPermissionOrderByWithRelationInput
    >
{
  protected modelName = "menuPermission" as const;
  constructor(prisma: PrismaService, errorHandlingService: ErrorHandlingService) {
    super(prisma, errorHandlingService);
  }
}
