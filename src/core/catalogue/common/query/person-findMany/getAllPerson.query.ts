import { Query } from "@nestjs/cqrs";
import { IPerson } from "../../dto/catalogue.type";

export class GetAllPersonQuery extends Query<IPerson[]> {
  constructor(public readonly typePersonId: number) {
    super();
  }
}
