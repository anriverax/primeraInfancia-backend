import { IFindUserByParams, IUser } from "@/core/auth/dto/auth.type";
import { Query } from "@nestjs/cqrs";

export class FindUniqueUserQuery extends Query<IUser | null> {
  constructor(public readonly params: IFindUserByParams) {
    super();
  }
}
