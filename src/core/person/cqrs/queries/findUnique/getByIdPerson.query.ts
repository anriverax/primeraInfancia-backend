import { IGetByIdPerson } from "@/core/person/dto/person.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdPersonQuery extends Query<IGetByIdPerson> {
  constructor(public readonly id: number) {
    super();
  }
}
