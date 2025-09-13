import { IPaginatedQueryParams } from "@/common/helpers/types";
import { IResponseSelectionOptionsWithPagination } from "@/core/responseSelectionOption/dto/responseSelectionOption.type";
import { Query } from "@nestjs/cqrs";

export class GetAllResponseSelectionOptionQuery extends Query<IResponseSelectionOptionsWithPagination> {
  constructor(public readonly data: IPaginatedQueryParams) {
    super();
  }
}
