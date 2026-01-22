import { PrismaService } from "@/services/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { School } from "prisma/generated/client";
import { ICreateSchool } from "../../dto/school.type";
import { ErrorHandlingService } from "@/services/errorHandling/error-handling.service";

@Injectable()
export class SchoolProjection {
  constructor(
    private prisma: PrismaService,
    private errorHandlingService: ErrorHandlingService
  ) {}

  async add(data: ICreateSchool): Promise<School> {
    try {
      return await this.prisma.school.create({ data });
    } catch (error) {
      this.errorHandlingService.handlePrismaError("SchoolProjection.add", error);
    }
  }
}
