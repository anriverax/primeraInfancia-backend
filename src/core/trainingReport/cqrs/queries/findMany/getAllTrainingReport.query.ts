import { IPaginatedQueryParams } from "@/common/helpers/dto";
import { ITrainingReportsWithPagination } from "@/core/trainingReport/dto/trainingReport.type";
import { Query } from "@nestjs/cqrs";

export class GetAllTrainingReportQuery extends Query<ITrainingReportsWithPagination> {
  constructor(public readonly data: IPaginatedQueryParams) {
    super();
  }
}
