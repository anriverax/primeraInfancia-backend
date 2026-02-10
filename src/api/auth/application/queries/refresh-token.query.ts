import { ILoginResponse } from "@/api/auth/application/dto/auth.type";
import { Query } from "@nestjs/cqrs";

export class GetRefreshTokenQuery extends Query<ILoginResponse> {
  constructor(
    public readonly token: string,
    public readonly email: string
  ) {
    super();
  }
}
