import { Query } from "@nestjs/cqrs";
import { UserKey } from "prisma/generated/client";

export class GetAllUserKeyByUserIdQuery extends Query<UserKey[] | []> {
  constructor(public readonly userId: number) {
    super();
  }
}
