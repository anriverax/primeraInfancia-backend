import { IGetZone } from "@/core/catalogue/zone/dto/zone.dto";
import { Query } from "@nestjs/cqrs";

export class GetAllZoneQuery extends Query<IGetZone[]> {
  constructor() {
    super();
  }
}
