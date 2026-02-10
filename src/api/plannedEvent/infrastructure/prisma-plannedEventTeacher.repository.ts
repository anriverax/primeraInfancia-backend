import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/services/prisma/prisma.service";
import { ErrorHandlingService } from "@/services/errorHandling/error-handling.service";
import { Prisma } from "prisma/generated/client";
import { IPlannedEventTeacherRepository } from "../domain/ports/plannedEventTeacher.repository.port";
import { PrismaGenericRepository } from "@/common/generic/infrastructure/prisma-generic.repository";

@Injectable()
export class PrismaPlannedEventTeacherRepository
  extends PrismaGenericRepository<
    Prisma.PlannedEventTeacherWhereInput,
    Prisma.PlannedEventTeacherSelect,
    Prisma.PlannedEventTeacherOrderByWithRelationInput
  >
  implements
    IPlannedEventTeacherRepository<
      Prisma.PlannedEventTeacherWhereInput,
      Prisma.PlannedEventTeacherSelect,
      Prisma.PlannedEventTeacherOrderByWithRelationInput
    >
{
  protected modelName = "plannedEventTeacher" as const;
  constructor(prisma: PrismaService, errorHandlingService: ErrorHandlingService) {
    super(prisma, errorHandlingService);
  }
}
