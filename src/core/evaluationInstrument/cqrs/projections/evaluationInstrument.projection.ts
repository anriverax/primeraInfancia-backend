import { Injectable } from "@nestjs/common";
import { EvaluationInstrument } from "@prisma/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import {
  ICreateEvaluationInstrument,
  IDeleteEvaluationInstrument,
  IUpdateEvaluationInstrument
} from "../../dto/evaluationInstrument.type";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class EvaluationInstrumentProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateEvaluationInstrument): Promise<EvaluationInstrument> {
    try {
      return await this.prisma.evaluationInstrument.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("EvaluationInstrumentProjection", error);
    }
  }

  async update(data: IUpdateEvaluationInstrument): Promise<EvaluationInstrument> {
    const { id, ...props } = data;

    try {
      return await this.prisma.evaluationInstrument.update({ where: { id }, data: props });
    } catch (error) {
      handlePrismaError("EvaluationInstrumentProjection", error);
    }
  }

  async delete(data: IDeleteEvaluationInstrument): Promise<EvaluationInstrument> {
    const { id } = data;

    try {
      return await this.prisma.softDelete("evaluationInstrument", { id });
    } catch (error) {
      handlePrismaError("EvaluationInstrumentProjection", error);
    }
  }
}
