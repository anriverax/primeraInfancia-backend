import { Injectable } from "@nestjs/common";
import { SurveyData } from "@prisma/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import { ICreateSurveyData, IDeleteSurveyData, IUpdateSurveyData } from "../../dto/surveyData.type";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class SurveyDataProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateSurveyData): Promise<SurveyData> {
    try {
      return await this.prisma.surveyData.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("SurveyDataProjection", error);
    }
  }

  async update(data: IUpdateSurveyData): Promise<SurveyData> {
    const { id, ...props } = data;

    try {
      return await this.prisma.surveyData.update({ where: { id }, data: props });
    } catch (error) {
      handlePrismaError("SurveyDataProjection", error);
    }
  }

  async delete(data: IDeleteSurveyData): Promise<SurveyData> {
    const { id, deletedBy  } = data;

    try {
      return await this.prisma.softDelete("surveyData", { id }, { deletedBy  });
    } catch (error) {
      handlePrismaError("SurveyDataProjection", error);
    }
  }
}