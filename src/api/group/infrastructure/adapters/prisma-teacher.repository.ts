import { PrismaService } from "@/services/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { ErrorHandlingService } from "@/services/errorHandling/error-handling.service";
import { Prisma } from "prisma/generated/client";
import { PrismaGenericRepository } from "@/common/generic/infrastructure/prisma-generic.repository";
import { ITeacherRepository } from "../../domain/ports/teacher.respository.port";

@Injectable()
export class PrismaTeacherRepository
  extends PrismaGenericRepository<
    Prisma.TeacherWhereInput,
    Prisma.TeacherSelect,
    Prisma.TeacherOrderByWithRelationInput
  >
  implements
    ITeacherRepository<
      Prisma.TeacherWhereInput,
      Prisma.TeacherSelect,
      Prisma.TeacherOrderByWithRelationInput
    >
{
  protected modelName = "teacher" as const;
  constructor(prisma: PrismaService, errorHandlingService: ErrorHandlingService) {
    super(prisma, errorHandlingService);
  }
}
