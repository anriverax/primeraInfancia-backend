import { IGetByIdSurveyData } from "@/temp/surveyData/dto/surveyData.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdSurveyDataQuery extends Query<IGetByIdSurveyData> {
  constructor(public readonly id: number) {
    super();
  }
}
