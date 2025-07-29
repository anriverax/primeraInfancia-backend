import { IPerson } from "@/core/helper/dto/helper.type";
import { Query } from "@nestjs/cqrs";

export class GetAllPersonByTypePersonQuery extends Query<IPerson[]> {
  constructor(
    public readonly typePersonId: number,
    public readonly zoneId: number
  ) {
    super();
  }
}
