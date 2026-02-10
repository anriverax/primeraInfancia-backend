import { Injectable } from "@nestjs/common";
import { IPlannedEventRepository } from "../domain/ports/plannedEvent.repository.port";
import { PrismaService } from "@/services/prisma/prisma.service";
import { ErrorHandlingService } from "@/services/errorHandling/error-handling.service";
import { Prisma } from "prisma/generated/client";
import { PrismaGenericRepository } from "@/common/generic/infrastructure/prisma-generic.repository";

@Injectable()
export class PrismaPlannedEventRepository
  extends PrismaGenericRepository<
    Prisma.PlannedEventWhereInput,
    Prisma.PlannedEventSelect,
    Prisma.PlannedEventOrderByWithRelationInput
  >
  implements
    IPlannedEventRepository<
      Prisma.PlannedEventWhereInput,
      Prisma.PlannedEventSelect,
      Prisma.PlannedEventOrderByWithRelationInput
    >
{
  protected modelName = "plannedEvent" as const;
  constructor(prisma: PrismaService, errorHandlingService: ErrorHandlingService) {
    super(prisma, errorHandlingService);
  }
}
