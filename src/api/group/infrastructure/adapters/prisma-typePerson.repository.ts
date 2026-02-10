import { PrismaService } from "@/services/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { ErrorHandlingService } from "@/services/errorHandling/error-handling.service";
import { Prisma } from "prisma/generated/client";
import { PrismaGenericRepository } from "@/common/generic/infrastructure/prisma-generic.repository";
import { ITypePersonRepository } from "../../domain/ports/typePerson.respository.port";

@Injectable()
export class PrismaTypePersonRepository
  extends PrismaGenericRepository<
    Prisma.TypePersonWhereInput,
    Prisma.TypePersonSelect,
    Prisma.TypePersonOrderByWithRelationInput
  >
  implements
    ITypePersonRepository<
      Prisma.TypePersonWhereInput,
      Prisma.TypePersonSelect,
      Prisma.TypePersonOrderByWithRelationInput
    >
{
  protected modelName = "typePerson" as const;
  constructor(prisma: PrismaService, errorHandlingService: ErrorHandlingService) {
    super(prisma, errorHandlingService);
  }
}
