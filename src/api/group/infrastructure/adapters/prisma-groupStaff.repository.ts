import { PrismaService } from "@/services/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { ErrorHandlingService } from "@/services/errorHandling/error-handling.service";
import { Prisma } from "prisma/generated/client";
import { PrismaGenericRepository } from "@/common/generic/infrastructure/prisma-generic.repository";
import { IGroupStaffRepository } from "../../domain/ports/groupStaff.respository.port";

@Injectable()
export class PrismaGroupStaffRepository
  extends PrismaGenericRepository<
    Prisma.GroupStaffWhereInput,
    Prisma.GroupStaffSelect,
    Prisma.GroupStaffOrderByWithRelationInput
  >
  implements
    IGroupStaffRepository<
      Prisma.GroupStaffWhereInput,
      Prisma.GroupStaffSelect,
      Prisma.GroupStaffOrderByWithRelationInput
    >
{
  protected modelName = "groupStaff" as const;
  constructor(prisma: PrismaService, errorHandlingService: ErrorHandlingService) {
    super(prisma, errorHandlingService);
  }
}
