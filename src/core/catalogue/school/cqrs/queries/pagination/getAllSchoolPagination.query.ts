import { IPaginatedQueryParams } from "@/common/helpers/types";
import { ISchoolWithPagination } from "../../../dto/school.type";
import { Query } from "@nestjs/cqrs";

export class GetAllSchoolPaginationQuery extends Query<ISchoolWithPagination> {
  constructor(public readonly data: IPaginatedQueryParams) {
    super();
  }
}
