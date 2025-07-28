import { Injectable } from "@nestjs/common";
import { TrainingEvaluation } from "@prisma/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import {
  ICreateTrainingEvaluation,
  IDeleteTrainingEvaluation,
  IUpdateTrainingEvaluation
} from "../../dto/trainingEvaluation.type";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class TrainingEvaluationProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateTrainingEvaluation): Promise<TrainingEvaluation> {
    try {
      return await this.prisma.trainingEvaluation.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("TrainingEvaluationProjection", error);
    }
  }

  async update(data: IUpdateTrainingEvaluation): Promise<TrainingEvaluation> {
    const { id, ...props } = data;

    try {
      return await this.prisma.trainingEvaluation.update({ where: { id }, data: props });
    } catch (error) {
      handlePrismaError("TrainingEvaluationProjection", error);
    }
  }

  async delete(data: IDeleteTrainingEvaluation): Promise<TrainingEvaluation> {
    const { id, deletedBy } = data;

    try {
      return await this.prisma.softDelete("trainingEvaluation", { id }, { deletedBy });
    } catch (error) {
      handlePrismaError("TrainingEvaluationProjection", error);
    }
  }
}
