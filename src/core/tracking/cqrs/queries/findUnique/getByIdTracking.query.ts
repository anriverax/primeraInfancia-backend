import { IGetByIdTracking } from "@/core/tracking/dto/tracking.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdTrackingQuery extends Query<IGetByIdTracking> {
  constructor(public readonly id: number) {
    super();
  }
}
