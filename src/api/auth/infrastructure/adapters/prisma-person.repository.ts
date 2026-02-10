import { PrismaService } from "@/services/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { IPersonRepository } from "../../domain/ports/persistence/person.repository.port";
import { ErrorHandlingService } from "@/services/errorHandling/error-handling.service";
import { Prisma } from "prisma/generated/client";
import { PrismaGenericRepository } from "@/common/generic/infrastructure/prisma-generic.repository";

@Injectable()
export class PrismaPersonRepository
  extends PrismaGenericRepository<
    Prisma.PersonWhereInput,
    Prisma.PersonSelect,
    Prisma.PersonOrderByWithRelationInput
  >
  implements
    IPersonRepository<
      Prisma.PersonWhereInput,
      Prisma.PersonSelect,
      Prisma.PersonOrderByWithRelationInput
    >
{
  protected modelName = "person" as const;
  constructor(prisma: PrismaService, errorHandlingService: ErrorHandlingService) {
    super(prisma, errorHandlingService);
  }
}
