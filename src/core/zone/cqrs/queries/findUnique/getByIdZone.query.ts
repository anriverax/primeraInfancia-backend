import { IGetZone } from "@/core/zone/dto/zone.dto";
import { Query } from "@nestjs/cqrs";

export class GetByIdZoneQuery extends Query<IGetZone> {
  constructor(public readonly id: number) {
    super();
  }
}
