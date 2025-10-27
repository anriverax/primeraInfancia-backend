import { IPaginatedQueryParams } from "@/common/helpers/types";
import { ISurveyDatasWithPagination } from "@/core/surveyData/dto/surveyData.type";
import { Query } from "@nestjs/cqrs";

export class GetAllSurveyDataQuery extends Query<ISurveyDatasWithPagination> {
  constructor(public readonly data: IPaginatedQueryParams) {
    super();
  }
}
