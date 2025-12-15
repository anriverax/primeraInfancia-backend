import { Query } from "@nestjs/cqrs";
import { PersonRole } from "prisma/generated/client";

export class GetPersonRoleByUserQuery extends Query<PersonRole | null> {
  constructor(public readonly userId: number) {
    super();
  }
}
