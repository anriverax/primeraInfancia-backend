import { ILoginResponse } from "@/api/auth/application/dto/auth.type";
import { Command } from "@nestjs/cqrs";

export class LoginCommand extends Command<ILoginResponse> {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {
    super();
  }
}
