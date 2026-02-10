import { IUser } from "@/api/auth/application/dto/auth.type";
import { Query } from "@nestjs/cqrs";
import { Request } from "express";

export class FindUniqueUserByIdQuery extends Query<IUser | null> {
  public readonly id: number;
  public readonly email: string;
  constructor(public readonly data: { req?: Request; email?: string } = {}) {
    super();
  }
}
