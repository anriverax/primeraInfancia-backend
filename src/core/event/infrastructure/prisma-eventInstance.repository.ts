import { ErrorHandlingService } from "@/services/errorHandling/error-handling.service";
import { PrismaService } from "@/services/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { Prisma } from "prisma/generated/client";
import { IEventInstanceRepository } from "../domain/eventInstance.repository.port";
import { PrismaGenericRepository } from "@/common/generic/infrastructure/prisma-generic.repository";

@Injectable()
export class PrismaEventInstanceRepository
  extends PrismaGenericRepository<
    Prisma.EventInstanceWhereInput,
    Prisma.EventInstanceSelect,
    Prisma.EventInstanceOrderByWithRelationInput
  >
  implements
    IEventInstanceRepository<
      Prisma.EventInstanceWhereInput,
      Prisma.EventInstanceSelect,
      Prisma.EventInstanceOrderByWithRelationInput
    >
{
  protected modelName = "eventInstance" as const;
  constructor(prisma: PrismaService, errorHandlingService: ErrorHandlingService) {
    super(prisma, errorHandlingService);
  }
}
