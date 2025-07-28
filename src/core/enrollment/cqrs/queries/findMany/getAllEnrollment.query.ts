import { IPaginatedQueryParams } from "@/common/helpers/dto";
import { IEnrollmentsWithPagination } from "@/core/enrollment/dto/enrollment.type";
import { Query } from "@nestjs/cqrs";

export class GetAllEnrollmentQuery extends Query<IEnrollmentsWithPagination> {
  constructor(public readonly data: IPaginatedQueryParams) {
    super();
  }
}
