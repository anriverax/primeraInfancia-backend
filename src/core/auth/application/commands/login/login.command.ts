import { ILoginResponse } from "@/core/auth/application/dto/auth.type";
import { Command } from "@nestjs/cqrs";

export class LoginCommand extends Command<ILoginResponse> {
  constructor(
    public readonly value1: string,
    public readonly value2: string
  ) {
    super();
  }
}
