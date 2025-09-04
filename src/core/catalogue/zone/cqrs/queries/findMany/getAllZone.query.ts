import { IGetZoneWithDept } from "@/core/catalogue/zone/dto/zone.dto";
import { Query } from "@nestjs/cqrs";

export class GetAllZoneQuery extends Query<IGetZoneWithDept[]> {
  constructor() {
    super();
  }
}
