import { IPaginatedQueryParams } from "@/common/helpers/types";
import { IPersonsWithPagination } from "@/core/person/dto/person.type";
import { Query } from "@nestjs/cqrs";

export class GetAllPersonQuery extends Query<IPersonsWithPagination> {
  constructor(public readonly data: IPaginatedQueryParams) {
    super();
  }
}
