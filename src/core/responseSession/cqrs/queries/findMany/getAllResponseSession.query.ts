import { IPaginatedQueryParams } from "@/common/helpers/types";
import { IResponseSessionsWithPagination } from "@/core/responseSession/dto/responseSession.type";
import { Query } from "@nestjs/cqrs";

export class GetAllResponseSessionQuery extends Query<IResponseSessionsWithPagination> {
  constructor(public readonly data: IPaginatedQueryParams) {
    super();
  }
}
