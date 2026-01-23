import { Command } from "@nestjs/cqrs";
import { Request } from "express";
import { UnauthorizedException } from "@nestjs/common";
import { ChangePasswdDto } from "@/core/auth/application/dto/auth.dto";

export class ChangePasswdCommand extends Command<boolean> {
  public readonly userId: number;
  public readonly oldEmail: string;
  public readonly newEmail: string;
  public readonly oldPassword: string;
  public readonly newPassword: string;
  constructor(
    public readonly req: Request,
    public readonly data: ChangePasswdDto
  ) {
    super();
    const getData = this.validateData(req);
    this.userId = getData.id;
    this.oldEmail = getData.email;
    this.oldPassword = data.value2;
    this.newEmail = data.value1 || "";
    this.newPassword = data.value3;
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
