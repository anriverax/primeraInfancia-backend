import { IGetPerson } from "@/core/person/dto/person.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdPersonQuery extends Query<IGetPerson> {
  constructor(public readonly id: number) {
    super();
  }
}
