import { IPaginatedQueryParams } from "@/common/helpers/dto";
import { IPersonRolesWithPagination } from "@/core/personRole/dto/personRole.type";
import { Query } from "@nestjs/cqrs";

export class GetAllPersonRoleQuery extends Query<IPersonRolesWithPagination> {
  constructor(public readonly data: IPaginatedQueryParams) {
    super();
  }
}
