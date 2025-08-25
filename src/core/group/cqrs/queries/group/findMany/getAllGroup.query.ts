import { IPaginatedQueryParams } from "@/common/helpers/types";
import { IGroupsWithPagination } from "@/core/group/dto/group.type";
import { Query } from "@nestjs/cqrs";

export class GetAllGroupQuery extends Query<IGroupsWithPagination> {
  constructor(public readonly data: IPaginatedQueryParams) {
    super();
  }
}
