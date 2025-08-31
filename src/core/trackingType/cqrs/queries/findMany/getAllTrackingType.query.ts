import { IPaginatedQueryParams } from "@/common/helpers/dto";
import { ITrackingTypesWithPagination } from "@/core/trackingType/dto/trackingType.type";
import { Query } from "@nestjs/cqrs";

export class GetAllTrackingTypeQuery extends Query<ITrackingTypesWithPagination> {
  constructor(public readonly data: IPaginatedQueryParams) {
    super();
  }
}
