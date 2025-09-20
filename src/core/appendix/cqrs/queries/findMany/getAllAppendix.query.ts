import { IPaginatedQueryParams } from "@/common/helpers/types";
import { IAppendixsWithPagination } from "@/core/appendix/dto/appendix.type";
import { Query } from "@nestjs/cqrs";

export class GetAllAppendixQuery extends Query<IAppendixsWithPagination> {
  constructor(public readonly data: IPaginatedQueryParams) {
    super();
  }
}
