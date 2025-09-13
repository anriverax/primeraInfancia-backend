import { IPaginatedQueryParams } from "@/common/helpers/types";
import { ISectionsWithPagination } from "@/core/section/dto/section.type";
import { Query } from "@nestjs/cqrs";

export class GetAllSectionQuery extends Query<ISectionsWithPagination> {
  constructor(public readonly data: IPaginatedQueryParams) {
    super();
  }
}
