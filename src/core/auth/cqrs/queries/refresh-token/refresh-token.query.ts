import { ILoginResponse } from "@/core/auth/dto/auth.type";
import { Query } from "@nestjs/cqrs";
import { Request } from "express";

export class GetRefreshTokenQuery extends Query<ILoginResponse> {
  constructor(
    public readonly req: Request,
    public readonly email: string
  ) {
    super();
  }
}
