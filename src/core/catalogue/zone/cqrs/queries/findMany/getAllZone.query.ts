import { IGetZoneWithDept } from "@/core/catalogue/zone/dto/zone.type";
import { Query } from "@nestjs/cqrs";

export class GetAllZoneQuery extends Query<IGetZoneWithDept[]> {
  constructor() {
    super();
  }
}
