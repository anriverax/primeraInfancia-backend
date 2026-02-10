import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/services/prisma/prisma.service";
import { ErrorHandlingService } from "@/services/errorHandling/error-handling.service";
import { Prisma } from "prisma/generated/client";
import { ISchoolRepository } from "../domain/school.repository.port";
import { PrismaGenericRepository } from "@/common/generic/infrastructure/prisma-generic.repository";

@Injectable()
export class PrismaSchoolRepository
  extends PrismaGenericRepository<
    Prisma.SchoolWhereInput,
    Prisma.SchoolSelect,
    Prisma.SchoolOrderByWithRelationInput
  >
  implements
    ISchoolRepository<
      Prisma.SchoolWhereInput,
      Prisma.SchoolSelect,
      Prisma.SchoolOrderByWithRelationInput
    >
{
  protected modelName = "school" as const;
  constructor(prisma: PrismaService, errorHandlingService: ErrorHandlingService) {
    super(prisma, errorHandlingService);
  }
}
