import { IPaginatedQueryParams } from "@/common/helpers/types";
import { IAppendixsWithPagination } from "@/core/appendixTest/dto/appendixTest.type";
import { Query } from "@nestjs/cqrs";

export class GetAllAppendixTestQuery extends Query<IAppendixsWithPagination> {
  constructor(public readonly data: IPaginatedQueryParams) {
    super();
  }
}
