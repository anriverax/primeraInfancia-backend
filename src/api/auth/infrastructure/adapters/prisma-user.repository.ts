import { PrismaService } from "@/services/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { Prisma } from "prisma/generated/client";
import { ErrorHandlingService } from "@/services/errorHandling/error-handling.service";
import { IUserRepository } from "../../domain/ports/persistence/user.repository.port";
import { PrismaGenericRepository } from "@/common/generic/infrastructure/prisma-generic.repository";

@Injectable()
export class PrismaUserRepository
  extends PrismaGenericRepository<
    Prisma.UserWhereInput,
    Prisma.UserSelect,
    Prisma.UserOrderByWithRelationInput
  >
  implements
    IUserRepository<Prisma.UserWhereInput, Prisma.UserSelect, Prisma.UserOrderByWithRelationInput>
{
  protected modelName = "user" as const;
  constructor(prisma: PrismaService, errorHandlingService: ErrorHandlingService) {
    super(prisma, errorHandlingService);
  }
}
