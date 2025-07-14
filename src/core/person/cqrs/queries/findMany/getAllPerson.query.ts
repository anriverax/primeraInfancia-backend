import { IGetPerson } from "@/core/person/dto/person.type";
import { Query } from "@nestjs/cqrs";

export class GetAllPersonQuery extends Query<IGetPerson[]> {
  constructor() {
    super();
  }
}
