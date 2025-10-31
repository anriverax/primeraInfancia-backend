import { Query } from "@nestjs/cqrs";
import { IGetAllSurveyData } from "@/core/surveyData/dto/surveyData.type";

export class GetByInscriptionSurveyDataQuery extends Query<IGetAllSurveyData[]> {
  constructor(
    public readonly inscriptionId: number,
    public readonly appendixId?: number
  ) {
    super();
  }
}
