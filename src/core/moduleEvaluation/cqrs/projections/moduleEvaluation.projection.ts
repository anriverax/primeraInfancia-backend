import { Injectable } from "@nestjs/common";
import { ModuleEvaluation } from "@prisma/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import {
  ICreateModuleEvaluation,
  IDeleteModuleEvaluation,
  IUpdateModuleEvaluation
} from "../../dto/moduleEvaluation.type";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class ModuleEvaluationProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateModuleEvaluation): Promise<ModuleEvaluation> {
    try {
      return await this.prisma.moduleEvaluation.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("ModuleEvaluationProjection", error);
    }
  }

  async update(data: IUpdateModuleEvaluation): Promise<ModuleEvaluation> {
    const { id, ...props } = data;

    try {
      return await this.prisma.moduleEvaluation.update({ where: { id }, data: props });
    } catch (error) {
      handlePrismaError("ModuleEvaluationProjection", error);
    }
  }

  async delete(data: IDeleteModuleEvaluation): Promise<ModuleEvaluation> {
    const { id, deletedBy } = data;

    try {
      return await this.prisma.softDelete("moduleEvaluation", { id }, { deletedBy });
    } catch (error) {
      handlePrismaError("ModuleEvaluationProjection", error);
    }
  }
}
