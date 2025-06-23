import { IGetZone } from "@/core/zone/dto/zone.dto";
import { Query } from "@nestjs/cqrs";

export class GetAllZoneQuery extends Query<IGetZone[]> {
  constructor() {
    super();
  }
}
