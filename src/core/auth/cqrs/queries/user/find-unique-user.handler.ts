import { IUser } from "@/core/auth/dto/auth.type";
import { Query } from "@nestjs/cqrs";

type IFindUserByParams = Partial<Pick<IUser, "id" | "email">>;
export class FindUniqueUserQuery extends Query<IUser | null> {
  constructor(public readonly params: IFindUserByParams) {
    super();
  }
}
