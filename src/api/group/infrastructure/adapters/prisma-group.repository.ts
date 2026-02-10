import { PrismaService } from "@/services/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { ErrorHandlingService } from "@/services/errorHandling/error-handling.service";
import { Prisma } from "prisma/generated/client";
import { PrismaGenericRepository } from "@/common/generic/infrastructure/prisma-generic.repository";
import { IGroupRepository } from "../../domain/ports/group.respository.port";

@Injectable()
export class PrismaGroupRepository
  extends PrismaGenericRepository<
    Prisma.GroupWhereInput,
    Prisma.GroupSelect,
    Prisma.GroupOrderByWithRelationInput
  >
  implements
    IGroupRepository<Prisma.GroupWhereInput, Prisma.GroupSelect, Prisma.GroupOrderByWithRelationInput>
{
  protected modelName = "group" as const;
  constructor(prisma: PrismaService, errorHandlingService: ErrorHandlingService) {
    super(prisma, errorHandlingService);
  }
}
