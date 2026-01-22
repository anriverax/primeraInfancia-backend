import { ILoginResponse } from "@/core/auth/dto/auth.type";
import { UnauthorizedException } from "@nestjs/common";
import { Query } from "@nestjs/cqrs";
import { Request } from "express";

export class GetRefreshTokenQuery extends Query<ILoginResponse> {
  public readonly email: string;
  constructor(public readonly req: Request) {
    super();
    const getEmail = this.validateData(req);
    this.email = getEmail;
  }

  private validateData(req: Request): string {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const user = req["user"] as any;
    /* eslint-enable @typescript-eslint/no-explicit-any */

    if (!user || !user.email || !user.sub) {
      throw new UnauthorizedException("Usuario no autenticado.");
    }

    return user.email;
  }
}
