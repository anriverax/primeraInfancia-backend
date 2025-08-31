import { IPaginatedQueryParams } from "@/common/helpers/dto";
import { IDetailOptionsWithPagination } from "@/core/detailOption/dto/detailOption.type";
import { Query } from "@nestjs/cqrs";

export class GetAllDetailOptionQuery extends Query<IDetailOptionsWithPagination> {
  constructor(public readonly data: IPaginatedQueryParams) {
    super();
  }
}
