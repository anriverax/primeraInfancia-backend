import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { IUpdateSurveyData } from "../../../dto/surveyData.type";

export class UpdateSurveyDataCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdateSurveyData) {
    super();
  }
}
