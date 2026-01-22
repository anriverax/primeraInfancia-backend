import { Command } from "@nestjs/cqrs";
import { NestResponse } from "@/common/helpers/types";
import { IUser } from "@/core/auth/dto/auth.type";
import { Request } from "express";
import { UnauthorizedException } from "@nestjs/common";

interface IChangePasswd extends Pick<IUser, "id"> {
  oldEmail: string;
  newEmail: string;
  hashedPassword: string;
}

export class ChangePasswdCommand extends Command<NestResponse<void>> {
  // const { oldEmail, oldPassword, newPassword, newEmail } = command;
  public readonly userId: number;
  constructor(
    public readonly req: Request,
    public readonly data: IChangePasswd
  ) {
    super();
    const getData = this.validateData(req);
    this.userId = getData.id;
    this
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
