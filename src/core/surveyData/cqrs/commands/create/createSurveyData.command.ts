import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { ICreateSurveyData } from "../../../dto/surveyData.type";
import { SurveyData } from "@prisma/client";

export class CreateSurveyDataCommand extends Command<NestResponse<SurveyData>> {
  constructor(public readonly data: ICreateSurveyData) {
    super();
  }
}
