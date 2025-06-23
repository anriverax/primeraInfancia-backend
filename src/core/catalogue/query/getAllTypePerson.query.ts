import { Query } from "@nestjs/cqrs";
import { ITypePerson } from "../dto/catalogue.type";

export class GetAllTypePersonQuery extends Query<ITypePerson[]> {
  constructor() {
    super();
  }
}
