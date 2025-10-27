import { Injectable } from "@nestjs/common";
import { SurveyData, Prisma } from "@prisma/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import { ICreateSurveyData, IDeleteSurveyData, IUpdateSurveyData } from "../../dto/surveyData.type";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class SurveyDataProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateSurveyData): Promise<SurveyData> {
    try {
      const payload = { ...data, survey: data.survey as Prisma.InputJsonValue };
      return await this.prisma.surveyData.create({ data: payload });
    } catch (error) {
      handlePrismaError("SurveyDataProjection", error);
    }
  }
  async update(data: IUpdateSurveyData): Promise<SurveyData> {
    const { id, ...props } = data;

    try {
      const updateData = {
        ...props,
        ...(Object.prototype.hasOwnProperty.call(props, "survey")
          ? /* eslint-disable @typescript-eslint/explicit-function-return-type */
            (() => {
              /* eslint-disable @typescript-eslint/no-explicit-any */
              const rawSurvey = (props as any).survey;
              /* eslint-enable @typescript-eslint/no-explicit-any */
              const surveyValue =
                rawSurvey === null ? Prisma.JsonNull : (rawSurvey as Prisma.InputJsonValue);
              return { survey: surveyValue };
            })()
          : /* eslint-enable @typescript-eslint/explicit-function-return-type */
            {})
      } as Prisma.SurveyDataUpdateInput;
      return await this.prisma.surveyData.update({ where: { id }, data: updateData });
    } catch (error) {
      handlePrismaError("SurveyDataProjection", error);
    }
  }

  async delete(data: IDeleteSurveyData): Promise<SurveyData> {
    const { id, deletedBy } = data;

    try {
      return await this.prisma.softDelete("surveyData", { id }, { deletedBy });
    } catch (error) {
      handlePrismaError("SurveyDataProjection", error);
    }
  }
}
