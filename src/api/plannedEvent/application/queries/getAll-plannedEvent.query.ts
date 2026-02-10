import { Query } from "@nestjs/cqrs";
import { IPlannedEventPagination } from "../dto/plannedEvent.type";
import { IPaginatedQueryParams } from "@/common/helpers/types";

export class GetAllPlannedEventQuery extends Query<IPlannedEventPagination> {
  constructor(
    public readonly userId: number,
    public readonly meta: IPaginatedQueryParams
  ) {
    super();
  }
}
