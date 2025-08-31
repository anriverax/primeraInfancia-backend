import { IGetByIdTrackingType } from "@/core/trackingType/dto/trackingType.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdTrackingTypeQuery extends Query<IGetByIdTrackingType> {
  constructor(public readonly id: number) {
    super();
  }
}
