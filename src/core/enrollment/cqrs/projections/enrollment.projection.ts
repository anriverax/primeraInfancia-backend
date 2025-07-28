import { Injectable } from "@nestjs/common";
import { Enrollment } from "@prisma/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import { ICreateEnrollment, IDeleteEnrollment, IUpdateEnrollment } from "../../dto/enrollment.type";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class EnrollmentProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateEnrollment): Promise<Enrollment> {
    try {
      return await this.prisma.enrollment.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("EnrollmentProjection", error);
    }
  }

  async update(data: IUpdateEnrollment): Promise<Enrollment> {
    const { id, ...props } = data;

    try {
      return await this.prisma.enrollment.update({ where: { id }, data: props });
    } catch (error) {
      handlePrismaError("EnrollmentProjection", error);
    }
  }

  async delete(data: IDeleteEnrollment): Promise<Enrollment> {
    const { id, deletedBy } = data;

    try {
      return await this.prisma.softDelete("enrollment", { id }, { deletedBy });
    } catch (error) {
      handlePrismaError("EnrollmentProjection", error);
    }
  }
}
