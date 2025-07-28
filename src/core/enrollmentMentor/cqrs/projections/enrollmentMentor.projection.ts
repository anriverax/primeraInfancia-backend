import { Injectable } from "@nestjs/common";
import { EnrollmentMentor } from "@prisma/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import {
  ICreateEnrollmentMentor,
  IDeleteEnrollmentMentor,
  IUpdateEnrollmentMentor
} from "../../dto/enrollmentMentor.type";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class EnrollmentMentorProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateEnrollmentMentor): Promise<EnrollmentMentor> {
    try {
      return await this.prisma.enrollmentMentor.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("EnrollmentMentorProjection", error);
    }
  }

  async update(data: IUpdateEnrollmentMentor): Promise<EnrollmentMentor> {
    const { id, ...props } = data;

    try {
      return await this.prisma.enrollmentMentor.update({ where: { id }, data: props });
    } catch (error) {
      handlePrismaError("EnrollmentMentorProjection", error);
    }
  }

  async delete(data: IDeleteEnrollmentMentor): Promise<EnrollmentMentor> {
    const { id, deletedBy } = data;

    try {
      return await this.prisma.softDelete("enrollmentMentor", { id }, { deletedBy });
    } catch (error) {
      handlePrismaError("EnrollmentMentorProjection", error);
    }
  }
}
