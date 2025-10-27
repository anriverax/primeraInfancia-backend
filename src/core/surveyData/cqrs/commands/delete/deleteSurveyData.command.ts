import { NestResponse } from "@/common/helpers/types";
import { IDeleteSurveyData } from "@/core/surveyData/dto/surveyData.type";
import { Command } from "@nestjs/cqrs";

export class DeleteSurveyDataCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteSurveyData) {
    super();
  }
}
