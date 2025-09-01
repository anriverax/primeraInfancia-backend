import { IPaginatedQueryParams } from "@/common/helpers/dto";
import { IResponseSessionsWithPagination } from "@/core/responseSession/dto/responseSession.type";
import { Query } from "@nestjs/cqrs";

export class GetAllResponseSessionQuery extends Query<IResponseSessionsWithPagination> {
  constructor(public readonly data: IPaginatedQueryParams) {
    super();
  }
}
