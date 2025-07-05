import { Query } from "@nestjs/cqrs";
import { TypePerson } from "@prisma/client";

export class GetAllTypePersonQuery extends Query<Pick<TypePerson, "id" | "name">[]> {
  constructor() {
    super();
  }
}
