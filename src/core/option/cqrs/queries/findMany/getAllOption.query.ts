import { IPaginatedQueryParams } from "@/common/helpers/types";
import { IOptionsWithPagination } from "@/core/option/dto/option.type";
import { Query } from "@nestjs/cqrs";

export class GetAllOptionQuery extends Query<IOptionsWithPagination> {
  constructor(public readonly data: IPaginatedQueryParams) {
    super();
  }
}
