import { Query } from "@nestjs/cqrs";
import { Person } from "prisma/generated/client";

export class GetPersonRoleByUserQuery extends Query<Person | null> {
  constructor(public readonly userId: number) {
    super();
  }
}
