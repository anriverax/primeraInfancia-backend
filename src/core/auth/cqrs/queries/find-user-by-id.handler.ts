import { IUser } from "@/core/auth/dto/auth.type";
import { UnauthorizedException } from "@nestjs/common";
import { Query } from "@nestjs/cqrs";
import { Request } from "express";

export class FindUserByIdQuery extends Query<IUser | null> {
  public readonly id: number;
  public readonly email: string;
  constructor(public readonly data: { req?: Request; email?: string }) {
    super();

    const getData = this.validateData(data.req);
    this.id = getData.id;
    this.email = getData.email;
  }

  private validateData(req?: Request): { id: number; email: string } {
    if (req !== undefined) {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const user = req["user"] as any;
      /* eslint-enable @typescript-eslint/no-explicit-any */

      if (!user || !user.email || !user.sub) {
        throw new UnauthorizedException("Usuario no autenticado.");
      }

      return { email: user.email, id: user.sub };
    }
    return { email: "", id: 0 };
  }
}
