import { Injectable } from "@nestjs/common";
import { TrainingReport } from "@prisma/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import {
  ICreateTrainingReport,
  IDeleteTrainingReport,
  IUpdateTrainingReport
} from "../../dto/trainingReport.type";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class TrainingReportProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateTrainingReport): Promise<TrainingReport> {
    try {
      return await this.prisma.trainingReport.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("TrainingReportProjection", error);
    }
  }

  async update(data: IUpdateTrainingReport): Promise<TrainingReport> {
    const { id, ...props } = data;

    try {
      return await this.prisma.trainingReport.update({ where: { id }, data: props });
    } catch (error) {
      handlePrismaError("TrainingReportProjection", error);
    }
  }

  async delete(data: IDeleteTrainingReport): Promise<TrainingReport> {
    const { id, deletedBy } = data;

    try {
      return await this.prisma.softDelete("trainingReport", { id }, { deletedBy });
    } catch (error) {
      handlePrismaError("TrainingReportProjection", error);
    }
  }
}
