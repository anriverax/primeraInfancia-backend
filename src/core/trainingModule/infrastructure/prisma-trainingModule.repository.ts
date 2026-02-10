import { ErrorHandlingService } from "@/services/errorHandling/error-handling.service";
import { PrismaService } from "@/services/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { ITrainingModuleRepository } from "../domain/trainingModule.respository.port";
import { Prisma } from "prisma/generated/client";
import { PrismaGenericRepository } from "@/common/generic/infrastructure/prisma-generic.repository";

@Injectable()
export class PrismaTrainingModuleRepository
  extends PrismaGenericRepository<
    Prisma.TrainingModuleWhereInput,
    Prisma.TrainingModuleSelect,
    Prisma.TrainingModuleOrderByWithRelationInput
  >
  implements
    ITrainingModuleRepository<
      Prisma.TrainingModuleWhereInput,
      Prisma.TrainingModuleSelect,
      Prisma.TrainingModuleOrderByWithRelationInput
    >
{
  protected modelName = "trainingModule" as const;

  constructor(prisma: PrismaService, errorHandlingService: ErrorHandlingService) {
    super(prisma, errorHandlingService);
  }
}
