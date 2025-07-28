import { IPaginatedQueryParams } from "@/common/helpers/dto";
import { IModuleReportsWithPagination } from "@/core/moduleReport/dto/moduleReport.type";
import { Query } from "@nestjs/cqrs";

export class GetAllModuleReportQuery extends Query<IModuleReportsWithPagination> {
  constructor(public readonly data: IPaginatedQueryParams) {
    super();
  }
}
