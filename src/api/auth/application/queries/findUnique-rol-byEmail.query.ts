import { Query } from "@nestjs/cqrs";
import { IUserWithPermissionsResponse } from "../dto/auth.type";

export class FindUniqueRolByEmailQuery extends Query<IUserWithPermissionsResponse | null> {
  constructor(public readonly email: string) {
    super();
  }
}
