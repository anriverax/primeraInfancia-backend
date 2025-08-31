import { IPaginatedQueryParams } from "@/common/helpers/dto";
import { ITrackingsWithPagination } from "@/core/tracking/dto/tracking.type";
import { Query } from "@nestjs/cqrs";

export class GetAllTrackingQuery extends Query<ITrackingsWithPagination> {
  constructor(public readonly data: IPaginatedQueryParams) {
    super();
  }
}
