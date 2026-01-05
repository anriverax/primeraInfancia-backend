import { Query } from "@nestjs/cqrs";
import { UserKey } from "prisma/generated/client";

export class GetByUserIdUserKeyQuery extends Query<UserKey | null> {
  constructor(public readonly userId: number) {
    super();
  }
}
